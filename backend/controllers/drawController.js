const Draw = require('../models/Draw');
const User = require('../models/User');
const Winning = require('../models/Winning');
const { sendWinnerEmail } = require('../utils/emailService');

const getUniqueRandomNumbers = (count, max) => {
  const nums = new Set();
  while (nums.size < count) nums.add(Math.floor(Math.random() * max) + 1);
  return Array.from(nums);
};

const getAlgorithmicNumbers = async (count, max) => {
  const users = await User.find({ isSubscribed: true });
  const freqs = {};
  users.forEach(u => u.scores.forEach(s => {
    freqs[s.value] = (freqs[s.value] || 0) + 1;
  }));
  
  let sortedNums = Object.keys(freqs).map(Number).sort((a,b) => freqs[b]-freqs[a]);
  const nums = new Set();
  
  for (let i = 0; i < sortedNums.length && nums.size < 2; i++) {
    nums.add(sortedNums[i]);
  }
  
  while (nums.size < count) nums.add(Math.floor(Math.random() * max) + 1);
  return Array.from(nums);
};

// @desc Simulate a new draw
// @route POST /api/draw/simulate
exports.simulateDraw = async (req, res) => {
  try {
    const { logicType } = req.body;
    
    const winningNumbers = logicType === 'algorithm' 
      ? await getAlgorithmicNumbers(5, 45) 
      : getUniqueRandomNumbers(5, 45);

    const activeSubscribers = await User.countDocuments({ isSubscribed: true });
    const monthlyPool = activeSubscribers * 10;
    
    const lastPublished = await Draw.findOne({ status: 'published' }).sort({ date: -1 });
    const rollover = lastPublished?.prizePool?.match5Pool && lastPublished.stats.match5 === 0 
      ? lastPublished.prizePool.match5Pool : 0;

    const prizePool = {
      total: monthlyPool + rollover,
      jackpotRollover: rollover,
      match5Pool: parseFloat(((monthlyPool * 0.40) + rollover).toFixed(2)),
      match4Pool: parseFloat((monthlyPool * 0.35).toFixed(2)),
      match3Pool: parseFloat((monthlyPool * 0.25).toFixed(2))
    };

    const draw = new Draw({ numbers: winningNumbers, status: 'simulated', prizePool });
    await draw.save();

    const users = await User.find({ isSubscribed: true });
    let stats = { match5: 0, match4: 0, match3: 0 };
    
    users.forEach(user => {
      const userNumbers = user.scores.slice(-5).map(s => s.value);
      let matches = 0;
      userNumbers.forEach(num => { if (winningNumbers.includes(num)) matches++; });
      if (matches === 5) stats.match5++;
      if (matches === 4) stats.match4++;
      if (matches === 3) stats.match3++;
    });

    draw.stats = stats;
    await draw.save();

    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Publish a draw
// @route POST /api/draw/publish/:id
exports.publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw || draw.status === 'published') return res.status(400).json({ message: 'Draw not found or already published' });
    
    draw.status = 'published';
    await draw.save();

    const users = await User.find({ isSubscribed: true });
    const { match5, match4, match3 } = draw.stats;

    for (let user of users) {
      const userNumbers = user.scores.slice(-5).map(s => s.value);
      let matchCount = 0;
      userNumbers.forEach(num => { if (draw.numbers.includes(num)) matchCount++; });

      if (matchCount >= 3) {
        let prize = 0;
        if (matchCount === 5) prize = draw.prizePool.match5Pool / (match5 || 1);
        if (matchCount === 4) prize = draw.prizePool.match4Pool / (match4 || 1);
        if (matchCount === 3) prize = draw.prizePool.match3Pool / (match3 || 1);

        const win = new Winning({
          userId: user._id,
          drawId: draw._id,
          matchType: matchCount,
          prizeAmount: parseFloat(prize.toFixed(2))
        });
        await win.save();

        await sendWinnerEmail(user.email, user.name, win.prizeAmount, matchCount);
      }
    }

    res.json({ message: 'Draw published, winners identified, and emails dispatched!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get latest published draw
// @route GET /api/draw/latest
exports.getLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne({ status: 'published' }).sort({ date: -1 });
    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Admin get absolute latest draw (simulated or published)
// @route GET /api/draw/admin/latest
exports.getAdminLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne().sort({ date: -1 });
    res.json(draw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Admin get absolute history of all published draws
// @route GET /api/draw/admin/history
exports.getAdminHistory = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ date: -1 });
    res.json(draws);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

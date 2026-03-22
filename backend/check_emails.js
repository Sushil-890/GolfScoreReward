const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const winners = await User.find({ isSubscribed: true });
        console.log('--- WINNERS IN DB ---');
        winners.forEach(u => console.log(`${u.name}: ${u.email}`));
        console.log('---------------------');
        process.exit();
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
};
check();

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [lastDraw, setLastDraw] = useState(null);
  const [winnings, setWinnings] = useState([]);
  const [score, setScore] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      verifyStripeSession(sessionId);
    } else {
      fetchData();
    }
  }, []);

  const verifyStripeSession = async (sessionId) => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      await axios.post(`${globalThis.API_URL}/subscriptions/verify-session`, { sessionId }, { headers });
      setSuccess('Payment successful! Your subscription is now active.');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchData();
    } catch (err) {
      setError('Could not verify your payment session. Please contact support.');
      fetchData();
    }
  };

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const [userRes, winsRes] = await Promise.all([
        axios.get(`${globalThis.API_URL}/scores/me`, { headers }),
        axios.get(`${globalThis.API_URL}/winnings/me`, { headers }).catch(() => ({data: []}))
      ]);
      
      setUser(userRes.data);
      setWinnings(winsRes.data);

      try {
        const drawRes = await axios.get(`${globalThis.API_URL}/draws/latest`);
        setLastDraw(drawRes.data);
      } catch (err) {}
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    if (!score || score < 1 || score > 45) return setError('Score must be between 1 and 45');

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      const res = await axios.post(`${globalThis.API_URL}/scores`, { value: Number(score) }, { headers });
      setSuccess('Score logged successfully!');
      setError(''); setScore('');
      setUser((prev) => ({ ...prev, scores: res.data }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add score');
    }
  };

  const handleUploadProof = async (winningId) => {
    if (!uploadFile) return alert('Select a file first');
    const formData = new FormData();
    formData.append('proof', uploadFile);

    try {
      const headers = { 
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      };
      await axios.post(`${globalThis.API_URL}/winnings/upload-proof/${winningId}`, formData, { headers });
      alert('Proof uploaded successfully and is pending review!');
      fetchData(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Proof upload failed');
    }
  };

  if (!user) return <div className="text-center mt-10">Loading Dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {user.name}</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className={`inline-block px-2 py-1 rounded text-white ${user.isSubscribed ? 'bg-green-500' : 'bg-red-500'}`}>
              {user.isSubscribed ? `Active Sub (${user.plan})` : 'Inactive Subscription'}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-gray-600">Supporting:</p>
          <p className="text-xl font-bold text-green-700">{user.charity?.name || 'Default Charity'}</p>
          <p className="text-sm">Contribution: {user.charityContributionPercentage}%</p>
        </div>
      </div>

      {!user.isSubscribed && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-xl font-bold text-red-700 mb-2">Subscription Required</h3>
          <p className="mb-4">You need an active subscription to access the full features, enter scores, and win draws.</p>
          <button onClick={() => navigate('/subscribe')} className="bg-red-600 text-white px-6 py-2 rounded font-bold">Subscribe Now</button>
        </div>
      )}

      {user.isSubscribed && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Score Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Your Rolling 5 Scores</h3>
              <form onSubmit={handleAddScore} className="mb-6 flex gap-2">
                <input 
                  type="number" min="1" max="45" placeholder="Enter Stableford 1-45"
                  className="border p-2 rounded flex-1 focus:ring-green-500"
                  value={score} onChange={(e) => setScore(e.target.value)}
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700">Add</button>
              </form>
              {error && <div className="text-red-600 bg-red-50 p-2 mb-4 text-sm rounded">{error}</div>}
              {success && <div className="text-green-600 bg-green-50 p-2 mb-4 text-sm rounded">{success}</div>}

              <div className="space-y-3 mt-4">
                {user.scores.map((s, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                    <span className="font-extrabold text-xl text-green-800">{s.value}</span>
                    <span className="text-sm text-gray-500">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                ))}
                {user.scores.length === 0 && <p className="text-gray-500 italic text-center">No scores yet. Max 5 allowed.</p>}
              </div>
            </div>
            
            {/* Draw & Winnings Section */}
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Latest Draw Results</h3>
                {lastDraw ? (
                  <div>
                    <div className="flex justify-center gap-3 mb-4">
                      {lastDraw.numbers.map((num, i) => (
                        <span key={i} className="w-12 h-12 rounded-full border-2 border-green-500 bg-green-50 text-green-700 flex items-center justify-center font-bold text-xl">{num}</span>
                      ))}
                    </div>
                  </div>
                ) : <p className="text-gray-500">No draws available yet.</p>}
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">My Winnings & Verifications</h3>
                {winnings.length === 0 && <p className="text-gray-500 italic">No winnings to show.</p>}
                
                {winnings.map(w => (
                  <div key={w._id} className="border p-4 rounded mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-lg text-green-600">${w.prizeAmount}</span>
                      <span className={`text-sm px-2 py-1 rounded font-bold
                        ${w.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                          w.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'}`}>
                        {w.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">From Draw on {new Date(w.drawId.date).toLocaleDateString()}</p>
                    <p className="text-sm">Matches: {w.matchType}</p>
                    
                    {w.status === 'Pending Proof' && (
                      <div className="mt-4 pt-4 border-t border-dashed">
                        <p className="text-sm mb-2 font-bold text-gray-700">Action Required: Upload Screenshot Proof</p>
                        <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} className="text-sm w-full mb-2" />
                        <button onClick={() => handleUploadProof(w._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-bold">Upload Verification</button>
                      </div>
                    )}
                    
                    {w.reviewNotes && (
                      <div className="mt-2 text-sm bg-red-50 text-red-700 p-2 rounded">
                        <strong>Admin Notes:</strong> {w.reviewNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

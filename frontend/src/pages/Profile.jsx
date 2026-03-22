import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [charities, setCharities] = useState([]);
  
  const [charityId, setCharityId] = useState('');
  const [percentage, setPercentage] = useState(10);
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, charitiesRes] = await Promise.all([
        axios.get(`${globalThis.API_URL}/scores/me`, { headers }),
        axios.get(`${globalThis.API_URL}/charities`)
      ]);
      setUser(userRes.data);
      setCharityId(userRes.data.charity?._id || '');
      setPercentage(userRes.data.charityContributionPercentage || 10);
      setCharities(charitiesRes.data);
    } catch(err) {
      setError('Failed to load profile');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (percentage < 10) return setError('Minimum contribution is 10%');

    try {
      await axios.put(`${globalThis.API_URL}/auth/me`, {
        charityId, charityContributionPercentage: percentage
      }, { headers });
      setSuccess('Profile updated successfully!');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch(err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (!user) return <div className="text-center mt-10">Loading Profile...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center border-b pb-4">Manage Profile & Settings</h2>
      
      {success && <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Read Only Account Details */}
        <div className="bg-white p-6 shadow rounded-lg border-t-4 border-gray-400">
          <h3 className="text-xl font-bold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subscription Status</p>
              <p className={`font-bold ${user.isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                {user.isSubscribed ? `Active (${user.plan.toUpperCase()})` : 'Inactive'}
              </p>
              {user.isSubscribed && user.renewalDate && (
                 <p className="text-xs text-gray-500 mt-1">Renews: {new Date(user.renewalDate).toLocaleDateString()}</p>
              )}
            </div>
            <div>
               <p className="text-sm text-gray-500">Total Account Winnings</p>
               <p className="font-bold text-green-700 text-lg">${user.totalWon || 0}</p>
            </div>
          </div>
        </div>

        {/* Mutable Charity Settings */}
        <div className="bg-white p-6 shadow rounded-lg border-t-4 border-green-600">
          <h3 className="text-xl font-bold mb-4">Charity Settings</h3>
          <p className="text-sm text-gray-600 mb-6">You can change your designated charity and adjust your voluntary contribution percentage at any time.</p>
          
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Supported Charity</label>
              <select 
                className="w-full border border-gray-300 p-2 rounded focus:ring-green-500"
                value={charityId} 
                onChange={(e) => setCharityId(e.target.value)}
              >
                {charities.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-semibold">Contribution %</label>
              <input 
                type="number"
                min="10" max="100"
                className="w-full border border-gray-300 p-2 rounded focus:ring-green-500"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum required contribution is 10%.</p>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition shadow">
              Save Charity Preferences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

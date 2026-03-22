import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [charities, setCharities] = useState([]);
  const [charityId, setCharityId] = useState('');
  const [percentage, setPercentage] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available charities
    axios.get(`${globalThis.API_URL}/charities`)
      .then(res => {
        setCharities(res.data);
        if (res.data.length > 0) setCharityId(res.data[0]._id);
      })
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (percentage < 10) return setError('Minimum charity contribution is 10%');

    try {
      const res = await axios.post(`${globalThis.API_URL}/auth/register`, { 
        name, email, password, charityId, charityContributionPercentage: percentage 
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role || 'user');
      onLogin?.(res.data.token, res.data.user.role || 'user');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Join the Impact</h2>
      {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 p-2 rounded focus:ring-green-500"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            className="w-full border border-gray-300 p-2 rounded focus:ring-green-500"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full border border-gray-300 p-2 rounded focus:ring-green-500"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Select A Charity</label>
          <select 
            className="w-full border border-gray-300 p-2 rounded focus:ring-green-500"
            value={charityId} 
            onChange={(e) => setCharityId(e.target.value)}
          >
            {charities.length === 0 && <option value="">No charities available yet</option>}
            {charities.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
           <label className="block text-gray-700 mb-1">Your Contribution % (Min 10%)</label>
           <input 
              type="number"
              min="10" max="100"
              className="w-full border border-gray-300 p-2 rounded focus:ring-green-500"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              title="A portion of your subscription goes to the charity"
           />
        </div>

        <button className="w-full bg-green-600 text-white py-3 mt-4 rounded font-bold hover:bg-green-700 transition">
          Register & Continue to Subscription
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-green-700 hover:underline">Already have an account? Login</Link>
      </div>
    </div>
  );
}

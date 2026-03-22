import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${globalThis.API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      window.location.href = res.data.user.role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            className="w-full border p-2 rounded"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full border p-2 rounded"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/register" className="text-blue-600 hover:underline">Don't have an account? Register</Link>
      </div>
    </div>
  );
}

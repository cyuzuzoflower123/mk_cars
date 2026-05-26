import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(userName, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to MK Cars</h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
      
       <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-gray-900 font-medium underline">Register</Link>
        </p>
       
      </form>
    </div>
  );
}

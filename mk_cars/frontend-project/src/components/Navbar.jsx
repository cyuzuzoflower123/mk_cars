import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      // ignore
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
      <Link to="/" className="text-xl font-bold tracking-wide">
         MK Cars
      </Link>

      {user ? (
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/employees" className="hover:text-gray-300">Employees</Link>
          <Link to="/posts" className="hover:text-gray-300">Posts</Link>
          <Link to="/reports" className="hover:text-gray-300">Reports</Link>
          <span className="text-gray-400 text-sm">Hi, {user.userName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/login" className="hover:text-gray-300">Login</Link>
          <Link to="/register" className="hover:text-gray-300">Register</Link>
        </div>
      )}
    </nav>
  );
}

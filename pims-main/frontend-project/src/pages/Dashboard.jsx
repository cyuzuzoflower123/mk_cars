import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, <span className="font-semibold">{user?.userName}</span>!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/employees"
          className="bg-white rounded shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">👥 Employees</h2>
          <p className="text-gray-500 text-sm">Manage employees — add, edit, or remove staff members.</p>
        </Link>

        <Link
          to="/posts"
          className="bg-white rounded shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">📝 Posts</h2>
          <p className="text-gray-500 text-sm">Manage posts / categories — create, update, or delete posts.</p>
        </Link>

        <Link
          to="/reports"
          className="bg-white rounded shadow p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">📊 Reports</h2>
          <p className="text-gray-500 text-sm">View statistics and generate reports for employees and posts.</p>
        </Link>
      </div>
    </div>
  );
}

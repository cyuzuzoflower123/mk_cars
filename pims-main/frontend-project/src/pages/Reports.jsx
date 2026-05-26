import { useState, useEffect, useRef } from 'react';
import { getEmployees, getPosts } from '../api';

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reportRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [empData, postData] = await Promise.all([
          getEmployees().catch(() => []),
          getPosts().catch(() => [])
        ]);
        setEmployees(Array.isArray(empData) ? empData : []);
        setPosts(Array.isArray(postData) ? postData : []);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalEmployees = employees.length;
  const totalPosts = posts.length;

  const statusStats = employees.reduce(
    (acc, emp) => {
      if (emp.status === 'Active') acc.active++;
      else acc.inactive++;
      return acc;
    },
    { active: 0, inactive: 0 }
  );

  const departmentStats = Object.values(
    employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unassigned';
      if (!acc[dept]) {
        acc[dept] = { name: dept, count: 0, totalSalary: 0 };
      }
      acc[dept].count++;
      acc[dept].totalSalary += Number(emp.salary) || 0;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);

  const genderStats = employees.reduce((acc, emp) => {
    const gender = emp.gender || 'Not specified';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const totalSalary = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
  const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
  const salaries = employees.filter(e => Number(e.salary) > 0).map(e => Number(e.salary));
  const maxSalary = salaries.length > 0 ? Math.max(...salaries) : 0;
  const minSalary = salaries.length > 0 ? Math.min(...salaries) : 0;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading report data...</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <button
          onClick={handlePrint}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 print:hidden"
        >
          🖨️ Print Report
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div ref={reportRef} className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-3xl font-bold text-gray-800">{totalEmployees}</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">Total Posts</p>
            <p className="text-3xl font-bold text-gray-800">{totalPosts}</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">Active Employees</p>
            <p className="text-3xl font-bold text-green-600">{statusStats.active}</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500">Inactive Employees</p>
            <p className="text-3xl font-bold text-red-600">{statusStats.inactive}</p>
          </div>
        </div>

        {/* Salary Summary */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Salary Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Payroll</p>
              <p className="text-xl font-semibold text-gray-800">${totalSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Salary</p>
              <p className="text-xl font-semibold text-gray-800">${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Highest Salary</p>
              <p className="text-xl font-semibold text-gray-800">${maxSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lowest Salary</p>
              <p className="text-xl font-semibold text-gray-800">${minSalary.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏢 Employees by Department</h2>
          {departmentStats.length === 0 ? (
            <p className="text-gray-400">No department data available</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 font-semibold text-gray-700">Department</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Employees</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Total Salary</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Avg Salary</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept) => (
                  <tr key={dept.name} className="border-t border-gray-100">
                    <td className="px-4 py-2">{dept.name}</td>
                    <td className="px-4 py-2">{dept.count}</td>
                    <td className="px-4 py-2">${dept.totalSalary.toLocaleString()}</td>
                    <td className="px-4 py-2">${(dept.totalSalary / dept.count).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Gender Distribution</h2>
          {Object.keys(genderStats).length === 0 ? (
            <p className="text-gray-400">No gender data available</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {Object.entries(genderStats).map(([gender, count]) => (
                <div key={gender} className="bg-gray-100 rounded px-4 py-2">
                  <span className="font-medium text-gray-700">{gender}:</span>{' '}
                  <span className="font-bold">{count}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Posts List */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Posts / Categories</h2>
          {posts.length === 0 ? (
            <p className="text-gray-400">No posts available</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {posts.map((post) => (
                <span key={post.postID} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                  {post.postName}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Employee List */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📄 Employee List</h2>
          {employees.length === 0 ? (
            <p className="text-gray-400">No employees available</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-gray-700">ID</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Name</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Email</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Department</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Position</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Status</th>
                    <th className="px-3 py-2 font-semibold text-gray-700">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employeeID} className="border-t border-gray-100">
                      <td className="px-3 py-2">{emp.employeeID}</td>
                      <td className="px-3 py-2">{emp.FirstName} {emp.LastName}</td>
                      <td className="px-3 py-2">{emp.email || '-'}</td>
                      <td className="px-3 py-2">{emp.department || '-'}</td>
                      <td className="px-3 py-2">{emp.position || '-'}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">${(Number(emp.salary) || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Report Footer */}
        <div className="text-center text-gray-400 text-sm py-4">
          Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          <br />
          MK Cars Employee Management System
        </div>
      </div>
    </div>
  );
}

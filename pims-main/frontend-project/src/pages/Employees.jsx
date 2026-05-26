import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getPosts } from '../api';

const emptyForm = {
  postID: 0,
  FirstName: '',
  LastName: '',
  gender: '',
  DateOfBirth: '',
  email: '',
  phoneNumber: '',
  position: '',
  HireDate: '',
  salary: 0,
  status: 'Active',
  department: '',
  address: '',
};

function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
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

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 :
              name === 'postID' ? parseInt(value) || 0 :
              value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!form.FirstName.trim() || !form.LastName.trim()) {
      setError('First name and last name are required');
      setSubmitting(false);
      return;
    }

    try {
      const dataToSend = {
        ...form,
        postID: form.postID || 1,
        salary: Number(form.salary) || 0,
      };

      if (editId !== null) {
        await updateEmployee(editId, dataToSend);
      } else {
        await createEmployee(dataToSend);
      }
      setForm({ ...emptyForm });
      setEditId(null);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (emp) => {
    setEditId(emp.employeeID);
    setForm({
      postID: emp.postID || 0,
      FirstName: emp.FirstName || '',
      LastName: emp.LastName || '',
      gender: emp.gender || '',
      DateOfBirth: formatDateForInput(emp.DateOfBirth),
      email: emp.email || '',
      phoneNumber: emp.phoneNumber || '',
      position: emp.position || '',
      HireDate: formatDateForInput(emp.HireDate),
      salary: emp.salary || 0,
      status: emp.status || 'Active',
      department: emp.department || '',
      address: emp.address || '',
    });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    setError('');
    try {
      await deleteEmployee(id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  const cancelForm = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setError(''); }}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Add Employee
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            {editId !== null ? 'Edit Employee' : 'New Employee'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">First Name *</label>
              <input name="FirstName" value={form.FirstName} onChange={handleChange} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Last Name *</label>
              <input name="LastName" value={form.LastName} onChange={handleChange} required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
              <input type="date" name="DateOfBirth" value={form.DateOfBirth} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Post / Category</label>
              <select name="postID" value={form.postID} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                <option value={0}>Select Post</option>
                {posts.map((p) => (
                  <option key={p.postID} value={p.postID}>{p.postName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Position</label>
              <input name="position" value={form.position} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
              <input name="department" value={form.department} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Hire Date</label>
              <input type="date" name="HireDate" value={form.HireDate} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Salary</label>
              <input type="number" name="salary" value={form.salary} onChange={handleChange} min="0" step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
              <input name="address" value={form.address} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gray-900 text-white px-5 py-2 rounded hover:bg-gray-800 text-sm disabled:bg-gray-400"
            >
              {submitting ? 'Saving...' : (editId !== null ? 'Update' : 'Create')}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              disabled={submitting}
              className="bg-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading employees...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-3 py-3 font-semibold text-gray-700">ID</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Name</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Gender</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Email</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Phone</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Position</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Department</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-3 py-3 font-semibold text-gray-700">Salary</th>
                <th className="px-3 py-3 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-gray-400">No employees found</td>
                </tr>
              )}
              {employees.map((emp) => (
                <tr key={emp.employeeID} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3">{emp.employeeID}</td>
                  <td className="px-3 py-3">{emp.FirstName} {emp.LastName}</td>
                  <td className="px-3 py-3">{emp.gender || '-'}</td>
                  <td className="px-3 py-3">{emp.email || '-'}</td>
                  <td className="px-3 py-3">{emp.phoneNumber || '-'}</td>
                  <td className="px-3 py-3">{emp.position || '-'}</td>
                  <td className="px-3 py-3">{emp.department || '-'}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {emp.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-3 py-3">{emp.salary ? `$${Number(emp.salary).toLocaleString()}` : '-'}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => startEdit(emp)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.employeeID)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

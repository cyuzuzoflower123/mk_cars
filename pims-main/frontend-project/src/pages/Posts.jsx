import { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../api';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [postName, setPostName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!postName.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await createPost(postName.trim());
      setPostName('');
      await load();
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await updatePost(id, editName.trim());
      setEditId(null);
      setEditName('');
      await load();
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    setError('');
    try {
      await deletePost(id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to delete post');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Posts / Categories</h1>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Post name"
          value={postName}
          onChange={(e) => setPostName(e.target.value)}
          disabled={submitting}
          className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={submitting || !postName.trim()}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {submitting ? 'Adding...' : 'Add Post'}
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading posts...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">Post Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">No posts found</td>
                </tr>
              )}
              {posts.map((p) => (
                <tr key={p.postID} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-sm">{p.postID}</td>
                  <td className="px-4 py-3 text-sm">
                    {editId === p.postID ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none"
                      />
                    ) : (
                      p.postName
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      {editId === p.postID ? (
                        <>
                          <button
                            onClick={() => handleUpdate(p.postID)}
                            disabled={submitting}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:bg-gray-400"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditId(null); setEditName(''); }}
                            className="bg-gray-400 text-white px-3 py-1 rounded text-xs hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditId(p.postID); setEditName(p.postName); }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.postID)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
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

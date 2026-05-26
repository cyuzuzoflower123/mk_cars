const BASE_URL = 'http://localhost:3000';

async function request(url, options) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 3000.');
    }
    throw err;
  }
}

// Auth
export const registerUser = (userName, password) =>
  request('/users', { method: 'POST', body: JSON.stringify({ userName, password }) });

export const loginUser = (userName, password) =>
  request('/login', { method: 'POST', body: JSON.stringify({ userName, password }) });

export const getSession = () => request('/session');

export const logoutUser = () =>
  request('/logout', { method: 'POST' });

// Posts
export const getPosts = () => request('/posts');

export const createPost = (postName) =>
  request('/posting', { method: 'POST', body: JSON.stringify({ postName }) });

export const updatePost = (id, postName) =>
  request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify({ postName }) });

export const deletePost = (id) =>
  request(`/posts/${id}`, { method: 'DELETE' });

// Employees
export const getEmployees = () => request('/employees');

export const createEmployee = (data) =>
  request('/employee', { method: 'POST', body: JSON.stringify(data) });

export const updateEmployee = (id, data) =>
  request(`/employee/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteEmployee = (id) =>
  request(`/employee/${id}`, { method: 'DELETE' });

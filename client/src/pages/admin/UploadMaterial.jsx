import { useState, useEffect } from 'react';
import { createMaterial } from '../../services/api';

const STUDY_API = 'http://localhost:5003/api/study-materials';

export default function UploadMaterial() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', fileUrl: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const token = localStorage.getItem('token');

  const categories = [
    { value: 'frontend', label: '🎨 Frontend' },
    { value: 'backend', label: '⚙️ Backend' },
    { value: 'database', label: '🗄️ Database' },
    { value: 'devops', label: '🚀 DevOps' },
    { value: 'other', label: '📦 Other' }
  ];

  const categoryColor = (cat) => {
    const colors = {
      frontend: 'bg-blue-100 text-blue-700',
      backend: 'bg-green-100 text-green-700',
      database: 'bg-yellow-100 text-yellow-700',
      devops: 'bg-red-100 text-red-700',
      other: 'bg-gray-100 text-gray-700'
    };
    return colors[cat] || 'bg-gray-100 text-gray-700';
  };

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(STUDY_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setRecentMaterials(data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch materials');
      }
    };
    fetchRecent();
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await createMaterial(form);
      setSuccess('Material uploaded successfully!');
      setForm({ title: '', description: '', category: '', fileUrl: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📚 Upload Study Material</h1>
        <p className="text-gray-500 mt-1">Add new study materials for students to access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form - Left Side */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                placeholder="e.g. React.js Fundamentals"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* File URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/file/... or https://example.com/material.pdf"
                value={form.fileUrl}
                onChange={e => setForm({ ...form, fileUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Describe what students will learn from this material..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-800 to-orange-600 hover:from-blue-900 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </span>
              ) : '📤 Upload Material'}
            </button>
          </form>
        </div>

        {/* Recent Materials - Right Side */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Recently Uploaded</h2>
          <p className="text-gray-400 text-sm mb-5">Last 5 materials added</p>

          {recentMaterials.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-sm">No materials yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMaterials.map((m, index) => (
                <div key={m._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{m.title}</p>
                       <p className="text-gray-400 text-xs mt-0.5">
                         🕒 {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </p>
                      </div>
                  <span className="w-2 h-2 bg-orange-400 rounded-full shrink-0"></span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
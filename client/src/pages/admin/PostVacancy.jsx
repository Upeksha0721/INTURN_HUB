import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const VACANCY_API = 'http://localhost:5002/api/vacancies';

export default function PostVacancy() {
  const { } = useAuth();
  const [form, setForm] = useState({
    title: '', company: '', description: '',
    location: '', deadline: '', imageUrl: '',
    salary: '', jobType: 'Internship', skills: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    setError('Image must be under 2MB!');
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    setForm(prev => ({ ...prev, imageUrl: reader.result }));
  };
  reader.readAsDataURL(file);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s)
      };
      const res = await fetch(VACANCY_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess('Vacancy posted successfully!');
        setForm({ title: '', company: '', description: '', location: '', deadline: '', imageUrl: '', salary: '', jobType: 'Internship', skills: '' });
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to post vacancy');
      }
    } catch (err) {
      setError('Failed to post vacancy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💼 Post New Vacancy</h1>
        <p className="text-gray-500 mt-1">Create a new internship vacancy for students.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
         {/* Image Upload */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Company Image <span className="text-gray-400">(optional)</span>
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100"
  />
  {form.imageUrl && (
    <div className="mt-2 relative">
      <img src={form.imageUrl} alt="preview" className="h-40 w-full object-cover rounded-lg border" />
      <button
        type="button"
        onClick={() => setForm({ ...form, imageUrl: '' })}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
      >✕</button>
       </div>
      )}
   </div>

          {/* Title & Company */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer Intern"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Google Sri Lanka"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Location & Job Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Colombo, Sri Lanka"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={form.jobType}
                onChange={e => setForm({ ...form, jobType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option>Internship</option>
                <option>Full-time</option>
                <option>Part-time</option>
              </select>
            </div>
          </div>

          {/* Salary & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary <span className="text-gray-400">(optional)</span></label>
              <input
                type="text"
                placeholder="e.g. LKR 45,000/month"
                value={form.salary}
                onChange={e => setForm({ ...form, salary: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills <span className="text-gray-400">(comma separated)</span></label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Describe the internship role and requirements..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Posting...' : '🚀 Post Vacancy'}
          </button>
        </form>
      </div>
    </div>
  );
}
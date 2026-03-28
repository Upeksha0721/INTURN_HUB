import { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';

const STUDY_API = 'http://localhost:5003/api/study-materials';

const categoryConfig = {
  frontend:  { color: 'bg-blue-100 text-blue-700',    border: 'border-blue-200',   icon: '🎨', gradient: 'from-blue-500 to-indigo-500' },
  backend:   { color: 'bg-green-100 text-green-700',  border: 'border-green-200',  icon: '⚙️', gradient: 'from-green-500 to-teal-500' },
  database:  { color: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200', icon: '🗄️', gradient: 'from-yellow-500 to-orange-500' },
  uiux:      { color: 'bg-purple-100 text-purple-700', border: 'border-purple-200', icon: '✏️', gradient: 'from-purple-500 to-pink-500' },
  other:     { color: 'bg-gray-100 text-gray-700',    border: 'border-gray-200',   icon: '📄', gradient: 'from-gray-500 to-slate-500' },
};

export default function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(STUDY_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMaterials(data);
      } catch (err) {
        setError('Failed to load study materials');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const categories = ['All', 'frontend', 'backend', 'database', 'uiux', 'other'];

  const filtered = materials.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Returns updatedAt if edited, otherwise createdAt
  const getDisplayDate = (m) => {
    const isEdited = m.updatedAt && m.updatedAt !== m.createdAt;
    return {
      date: new Date(isEdited ? m.updatedAt : m.createdAt).toLocaleDateString(),
      isEdited
    };
  };

  if (loading) return <Spinner message="Loading study materials..." />;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">📚 Study Materials</h1>
          <p className="text-gray-400 mb-6">Access curated resources to prepare for your internship journey</p>

          {/* Search */}
          <div className="relative max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search materials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400/60 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 -mt-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <div className="text-2xl mb-1">📚</div>
            <div className="text-2xl font-bold text-indigo-600">{materials.length}</div>
            <div className="text-gray-500 text-xs mt-1">Total Materials</div>
          </div>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const count = materials.filter(m => m.category === key).length;
            if (count === 0) return null;
            return (
              <div key={key} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <div className="text-2xl mb-1">{config.icon}</div>
                <div className={`text-2xl font-bold ${config.color.split(' ')[1]}`}>{count}</div>
                <div className="text-gray-500 text-xs mt-1 capitalize">{key === 'uiux' ? 'UI/UX Design' : key}</div>
              </div>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat === 'All' ? '📋 All' : `${categoryConfig[cat]?.icon} ${cat}`}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Materials Found</h3>
            <p className="text-gray-400">Try changing your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((material) => {
              const config = categoryConfig[material.category] || categoryConfig.other;
              const { date, isEdited } = getDisplayDate(material);
              return (
                <div
                  key={material._id}
                  className={`bg-white rounded-2xl shadow-sm border ${config.border} hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden`}
                >
                  {/* Card Top Banner */}
                  <div className={`h-2 bg-gradient-to-r ${config.gradient}`}></div>

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-2xl shadow-sm`}>
                        {config.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${config.color}`}>
                        {material.category}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{material.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{material.description || 'No description available.'}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <span>📅 {date}</span>
                      {isEdited && (
                        <span className="text-blue-400 font-medium">✏️ updated</span>
                      )}
                    </div>

                    {/* Download Button */}
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r ${config.gradient} text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:opacity-90`}
                    >
                      <span>⬇️</span> Download Material
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
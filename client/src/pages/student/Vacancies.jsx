import { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';

const VACANCY_API = 'http://localhost:5002/api/vacancies';

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await fetch(VACANCY_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setVacancies(data);
      } catch (err) {
        console.error('Failed to fetch vacancies');
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  const handleApply = async (id) => {
    setApplying(id);
    try {
      const res = await fetch(`${VACANCY_API}/${id}/apply`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) alert('✅ Applied successfully!');
      else alert(`❌ ${data.message || 'Failed to apply'}`);
    } catch {
      alert('❌ Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const jobTypeColor = (type) => {
    if (type === 'Full-time') return 'bg-green-100 text-green-700';
    if (type === 'Part-time') return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  const filtered = vacancies.filter(v => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || v.jobType === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <Spinner message="Loading vacancies..." />;

  return (
    <div className="p-8">
      {/* Image Modal */}
      {selectedImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    style={{ overflow: 'hidden' }}
    onClick={() => setSelectedImage(null)}
  >
    <div
      className="relative max-w-3xl w-full max-h-screen overflow-y-auto rounded-xl"
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={() => setSelectedImage(null)}
        className="sticky top-2 left-full z-10 mr-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg"
      >✕</button>
      <img
        src={selectedImage}
        alt="Vacancy"
        className="w-full rounded-xl shadow-2xl"
      />
    </div>
  </div>
)}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">💼 Internship Vacancies</h1>
        <p className="text-gray-500 mt-1">Discover and apply for your next great opportunity.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search by title or company..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option>All</option>
          <option>Internship</option>
          <option>Full-time</option>
          <option>Part-time</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">💼</div>
          <p>No vacancies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(vacancy => (
            <div key={vacancy._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all">

              {/* Image — clickable to open modal */}
              {vacancy.imageUrl ? (
                <div className="relative group cursor-pointer" onClick={() => setSelectedImage(vacancy.imageUrl)}>
                  <img
                    src={vacancy.imageUrl}
                    alt={vacancy.company}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full">
                      🔍 View Full Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl">💼</span>
                </div>
              )}

              <div className="p-5">
                {/* Job Type Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${jobTypeColor(vacancy.jobType)}`}>
                    {vacancy.jobType || 'Internship'}
                  </span>
                  {vacancy.deadline && (
                    <span className="text-gray-400 text-xs">⏰ {new Date(vacancy.deadline).toLocaleDateString()}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{vacancy.title}</h3>
                <p className="text-indigo-600 font-medium text-sm mb-1">🏢 {vacancy.company}</p>
                <p className="text-gray-500 text-sm mb-2">📍 {vacancy.location}</p>

                {vacancy.salary && (
                  <p className="text-green-600 text-sm font-medium mb-3">💰 {vacancy.salary}</p>
                )}

                {vacancy.description && (
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{vacancy.description}</p>
                )}

                {/* Skills */}
                {vacancy.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {vacancy.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleApply(vacancy._id)}
                  disabled={applying === vacancy._id}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {applying === vacancy._id ? '⏳ Applying...' : '🚀 Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
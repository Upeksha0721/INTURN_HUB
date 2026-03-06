import { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';

const STUDY_API = 'http://localhost:5003/api/study-materials';

export default function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const categoryColors = {
    frontend: 'bg-blue-100 text-blue-700',
    backend: 'bg-green-100 text-green-700',
    database: 'bg-yellow-100 text-yellow-700',
    devops: 'bg-red-100 text-red-700',
    other: 'bg-gray-100 text-gray-700',
  };

  if (loading) return <Spinner message="Loading study materials..." />;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📚 Study Materials</h1>
        <p className="text-gray-500 mt-1">Access study resources for your internship preparation.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {materials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Materials Yet</h3>
          <p className="text-gray-400">Study materials will appear here once the admin uploads them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">📄</div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[material.category] || categoryColors.other}`}>
                  {material.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{material.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{material.description}</p>
              <a
                href={material.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-all"
              >
                Download Material
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
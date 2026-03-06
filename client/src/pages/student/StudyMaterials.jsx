import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5003/api/study-materials')
      .then(res => {
        setMaterials(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load materials.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Study Materials</h1>
      <p className="text-gray-500 mb-8">Access study resources for your internship preparation.</p>

      {loading && <p className="text-gray-400 text-center py-8">Loading materials...</p>}
      {error && <p className="text-red-500 text-center py-8">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(material => (
          <div key={material._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="mb-3">
              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                {material.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{material.title}</h3>
            <p className="text-gray-500 text-sm mb-4">{material.description}</p>
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg text-sm transition-all"
            >
              View Material →
            </a>
          </div>
        ))}
      </div>

      {!loading && materials.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-400 py-8">No study materials available yet.</p>
        </div>
      )}
    </div>
  );
}
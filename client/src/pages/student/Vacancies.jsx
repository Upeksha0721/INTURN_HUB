import { useState, useEffect } from 'react';
import { getVacancies, applyVacancy, getMyApplications } from '../../services/api';

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(null); // Track applying status by vacancy ID
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vacRes, appRes] = await Promise.all([
        getVacancies(),
        getMyApplications()
      ]);
      setVacancies(vacRes.data);
      setApplications(appRes.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load vacancies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (vacancyId) => {
    try {
      setApplying(vacancyId);
      await applyVacancy(vacancyId);
      setSuccessMsg('Successfully applied!');

      // Update local applications state
      const newAppRes = await getMyApplications();
      setApplications(newAppRes.data);

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setApplying(null);
    }
  };

  const hasApplied = (vacancyId) => {
    return applications.some(app => app.vacancyId?._id === vacancyId || app.vacancyId === vacancyId);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          💼 Internship Vacancies
        </h1>
        <p className="text-lg text-gray-500">
          Discover and apply for your next great opportunity.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm transition-all duration-300 transform">
          <p className="text-green-700 font-medium">{successMsg}</p>
        </div>
      )}

      {vacancies.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-gray-900">No vacancies available</h3>
          <p className="text-gray-500 mt-2">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <div
              key={vacancy._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {vacancy.title}
                  </h2>
                </div>

                <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                  <span className="mr-2 text-indigo-500">🏢</span>
                  {vacancy.company}
                </h3>

                <div className="space-y-2 mb-6">
                  {vacancy.location && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2 text-gray-400">📍</span>
                      {vacancy.location}
                    </p>
                  )}
                  {vacancy.deadline && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2 text-gray-400">⏳</span>
                      Deadline: {new Date(vacancy.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {vacancy.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => handleApply(vacancy._id)}
                  disabled={hasApplied(vacancy._id) || applying === vacancy._id}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex justify-center items-center ${hasApplied(vacancy._id)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                >
                  {applying === vacancy._id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying...
                    </span>
                  ) : hasApplied(vacancy._id) ? (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      Applied
                    </span>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
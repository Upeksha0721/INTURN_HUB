import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const STUDY_API = 'http://localhost:5003/api/study-materials';
const AUTH_API = 'http://localhost:5001/api/auth';
const VACANCY_API = 'http://localhost:5002/api/vacancies';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ materials: 0, vacancies: 0 });
  const [profile, setProfile] = useState(null);
  const [recentVacancies, setRecentVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, vacancyRes, profileRes] = await Promise.all([
          fetch(STUDY_API, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(VACANCY_API, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${AUTH_API}/profile`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const materials = await materialsRes.json();
        const vacancies = await vacancyRes.json();
        const profileData = await profileRes.json();
        setStats({ materials: materials.length, vacancies: vacancies.length });
        setRecentVacancies(vacancies.slice(0, 3));
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner message="Loading dashboard..." />;

  const statCards = [
    { icon: '💼', label: 'Available Vacancies', value: stats.vacancies, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600', path: '/student/vacancies' },
    { icon: '📋', label: 'My Applications', value: 0, color: 'from-green-500 to-teal-600', bg: 'bg-green-50', text: 'text-green-600', path: '/student/applications' },
    { icon: '📚', label: 'Study Materials', value: stats.materials, color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-600', path: '/student/study-materials' },
    { icon: '🧠', label: 'Quizzes Taken', value: 0, color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', text: 'text-orange-600', path: '/student/quizzes' },
  ];

  const quickActions = [
    { label: 'Browse Vacancies', icon: '🔍', color: 'bg-blue-600 hover:bg-blue-700', path: '/student/vacancies' },
    { label: 'My Applications', icon: '📋', color: 'bg-green-600 hover:bg-green-700', path: '/student/applications' },
    { label: 'Study Materials', icon: '📖', color: 'bg-purple-600 hover:bg-purple-700', path: '/student/study-materials' },
    { label: 'Take a Quiz', icon: '✏️', color: 'bg-orange-600 hover:bg-orange-700', path: '/student/quizzes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-indigo-200">Ready to find your dream internship today?</p>
          </div>
          {/* Avatar */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-semibold">{profile?.name}</p>
              <p className="text-indigo-200 text-sm">{profile?.email}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 -mt-6">
          {statCards.map(card => (
            <div
              key={card.label}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center text-xl`}>
                  {card.icon}
                </div>
                <span className={`text-xs font-medium ${card.text} ${card.bg} px-2 py-1 rounded-full`}>View →</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              <div className="text-gray-500 text-sm mt-1">{card.label}</div>
              {/* Mini gradient bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${card.color} rounded-full mt-3 opacity-30`}></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Banner */}
            <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-8 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="mb-1">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {profile?.role}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{profile?.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Member since</span>
                  <span className="text-gray-700 font-medium">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Vacancies */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800">Recent Vacancies</h2>
              <button
                onClick={() => navigate('/student/vacancies')}
                className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
              >
                View All →
              </button>
            </div>
            {recentVacancies.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">💼</div>
                <p>No vacancies available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentVacancies.map(v => (
                  <div key={v._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-all cursor-pointer" onClick={() => navigate('/student/vacancies')}>
                    {v.imageUrl ? (
                      <img src={v.imageUrl} alt={v.company} className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">💼</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{v.title}</p>
                      <p className="text-gray-500 text-sm">{v.company} • {v.location}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                      {v.jobType || 'Internship'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={`${action.color} text-white p-4 rounded-xl text-center transition-all hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const STUDY_API = 'http://localhost:5003/api/study-materials';
const AUTH_API = 'http://localhost:5001/api/auth';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ materials: 0 });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch materials count
        const materialsRes = await fetch(STUDY_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const materials = await materialsRes.json();
        setStats({ materials: materials.length });

        // Fetch profile
        const profileRes = await fetch(`${AUTH_API}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickActions = [
    { label: 'Browse Vacancies', icon: '🔍', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700', path: '/student/vacancies' },
    { label: 'My Applications', icon: '📋', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700', path: '/student/applications' },
    { label: 'Study Materials', icon: '📖', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700', path: '/student/study-materials' },
    { label: 'Take a Quiz', icon: '✏️', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700', path: '/student/quizzes' },
  ];

  if (loading) return <Spinner message="Loading dashboard..." />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your internship journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">My Profile</h2>
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{profile?.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{profile?.email}</p>
            <span className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              {profile?.role}
            </span>
            <div className="mt-4 w-full border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Member since</span>
                <span className="text-gray-700 font-medium">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">💼</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-gray-500 text-sm">Available Vacancies</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">📋</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-gray-500 text-sm">My Applications</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">📚</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{stats.materials}</div>
              <div className="text-gray-500 text-sm">Study Materials</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl">🧠</div>
            <div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-gray-500 text-sm">Quizzes Taken</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`${action.color} p-4 rounded-xl text-center transition-all`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium">{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
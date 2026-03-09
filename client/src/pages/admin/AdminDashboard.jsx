import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';

const AUTH_API = 'http://localhost:5001/api/auth';
const STUDY_API = 'http://localhost:5003/api/study-materials';
const VACANCY_API = 'http://localhost:5002/api/vacancies';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, materials: 0, vacancies: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await fetch(`${AUTH_API}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const users = await usersRes.json();
        const students = users.filter(u => u.role === 'student');

        // Fetch materials
        const materialsRes = await fetch(STUDY_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const materials = await materialsRes.json();

        // Fetch vacancies
        const vacancyRes = await fetch(VACANCY_API, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const vacancies = await vacancyRes.json();

        setStats({
          students: students.length,
          materials: materials.length,
          vacancies: vacancies.length
        });

        // Build activity feed
        const userActivities = students.slice(0, 2).map(u => ({
          id: u._id,
          icon: '👤',
          text: `${u.name} registered as student`,
          time: new Date(u.createdAt),
          color: 'bg-blue-100'
        }));

        const materialActivities = materials.slice(0, 2).map(m => ({
          id: m._id,
          icon: '📚',
          text: `Study material "${m.title}" uploaded`,
          time: new Date(m.createdAt),
          color: 'bg-purple-100'
        }));

        const vacancyActivities = vacancies.slice(0, 2).map(v => ({
          id: v._id,
          icon: '💼',
          text: `Vacancy "${v.title}" posted at ${v.company}`,
          time: new Date(v.createdAt),
          color: 'bg-green-100'
        }));

        // Combine and sort by date newest first
        const allActivities = [...userActivities, ...materialActivities, ...vacancyActivities]
          .sort((a, b) => b.time - a.time)
          .slice(0, 6)
          .map(a => ({ ...a, time: a.time.toLocaleDateString() }));

        setActivities(allActivities);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    { label: 'Post New Vacancy', icon: '➕', color: 'bg-green-50 hover:bg-green-100 text-green-700', path: '/admin/post-vacancy' },
    { label: 'View Applications', icon: '📋', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700', path: '/admin/applications' },
    { label: 'Upload Material', icon: '📤', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700', path: '/admin/upload-material' },
    { label: 'Create Quiz', icon: '✏️', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700', path: '/admin/create-quiz' },
  ];

  if (loading) return <Spinner message="Loading dashboard..." />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's your InternHub admin overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.students}</div>
            <div className="text-gray-500 text-sm">Total Students</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">💼</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.vacancies}</div>
            <div className="text-gray-500 text-sm">Active Vacancies</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">📋</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">0</div>
            <div className="text-gray-500 text-sm">Applications</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">📚</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.materials}</div>
            <div className="text-gray-500 text-sm">Study Materials</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-lg`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm font-medium">{activity.text}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
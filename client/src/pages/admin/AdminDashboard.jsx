import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Students', value: '24', icon: '👥', color: 'bg-blue-500' },
    { label: 'Active Vacancies', value: '12', icon: '💼', color: 'bg-green-500' },
    { label: 'Applications', value: '36', icon: '📋', color: 'bg-yellow-500' },
    { label: 'Study Materials', value: '8', icon: '📚', color: 'bg-purple-500' },
  ];

  const quickActions = [
    { label: 'Post New Vacancy', icon: '➕', path: '/admin/post-vacancy', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { label: 'View Applications', icon: '📄', path: '/admin/applications', color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
    { label: 'Upload Material', icon: '📤', path: '/admin/upload-material', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { label: 'Create Quiz', icon: '✏️', path: '/admin/create-quiz', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your InternHub admin overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all cursor-pointer ${action.color}`}
            >
              <span className="text-3xl mb-2">{action.icon}</span>
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { text: 'New student registered', time: '2 mins ago', icon: '👤' },
            { text: 'New application submitted', time: '15 mins ago', icon: '📋' },
            { text: 'Vacancy posted successfully', time: '1 hour ago', icon: '💼' },
            { text: 'Study material uploaded', time: '2 hours ago', icon: '📚' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{activity.text}</p>
              </div>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
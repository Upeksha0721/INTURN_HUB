import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Available Vacancies', value: '12', icon: '💼', color: 'bg-blue-500' },
    { label: 'My Applications', value: '3', icon: '📋', color: 'bg-green-500' },
    { label: 'Study Materials', value: '8', icon: '📚', color: 'bg-purple-500' },
    { label: 'Quizzes Taken', value: '5', icon: '🧠', color: 'bg-orange-500' },
  ];

  return (
    <div className="p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your internship journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4"
          >
            <div
              className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
            >
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Browse Vacancies', icon: '🔍', path: '/student/vacancies' },
            { label: 'My Applications', icon: '📄', path: '/student/applications' },
            { label: 'Study Materials', icon: '📖', path: '/student/study-materials' },
            { label: 'Take a Quiz', icon: '✏️', path: '/student/quizzes' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.path}
              className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all cursor-pointer"
            >
              <span className="text-3xl mb-2">{action.icon}</span>
              <span className="text-sm font-medium text-indigo-700 text-center">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
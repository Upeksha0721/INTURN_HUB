import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/student/dashboard',       label: '🏠 Dashboard' },
  { path: '/student/vacancies',       label: '💼 Vacancies' },
  { path: '/student/applications',    label: '📋 My Applications' },
  { path: '/student/study-materials', label: '📚 Study Materials' },
  { path: '/student/quizzes',         label: '🧠 Quizzes' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-indigo-900 text-white flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-indigo-700">
        <h1 className="text-2xl font-bold text-white">🎓 InternHub</h1>
        <p className="text-indigo-300 text-sm mt-1">Student Portal</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-indigo-300 text-xs">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
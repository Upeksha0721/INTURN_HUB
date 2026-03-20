import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/student/dashboard',       label: 'Dashboard',       icon: '🏠' },
  { path: '/student/vacancies',       label: 'Vacancies',       icon: '💼' },
  { path: '/student/applications',    label: 'My Applications', icon: '📋' },
  { path: '/student/study-materials', label: 'Study Materials', icon: '📚' },
  { path: '/student/quizzes',         label: 'Quizzes',         icon: '🧠' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`h-screen ${collapsed ? 'w-20' : 'w-64'} bg-indigo-900 text-white flex flex-col fixed left-0 top-0 transition-all duration-300 z-40`}>

        {/* Logo + Toggle */}
        <div className={`p-4 border-b border-indigo-700 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">🎓 InternHub</h1>
              <p className="text-indigo-300 text-xs mt-0.5">Student Portal</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 rounded-xl bg-indigo-700 hover:bg-indigo-600 flex items-center justify-center transition-all text-white text-lg"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b border-indigo-700 ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-indigo-300 text-xs truncate">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ''}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                }`
              }
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
            className={`w-full px-3 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content margin adjusts automatically */}
      <style>{`
        main { margin-left: ${collapsed ? '80px' : '256px'}; transition: margin-left 0.3s; }
      `}</style>
    </>
  );
}
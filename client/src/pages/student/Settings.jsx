import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AUTH_API = 'http://localhost:5001/api/auth';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'false');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    photo: '',
  });
  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_API}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          photo: data.photo || '',
        });
      } catch (err) { console.error('Failed to fetch profile'); }
    };
    fetchProfile();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Photo must be under 2MB!'); return; }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 200; canvas.height = 200;
      ctx.drawImage(img, 0, 0, 200, 200);
      setProfile(prev => ({ ...prev, photo: canvas.toDataURL('image/jpeg', 0.8) }));
    };
    img.src = URL.createObjectURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true); setSuccess(''); setError('');
    try {
      const payload = { name: profile.name, email: profile.email, phone: profile.phone, photo: profile.photo };
      if (passwords.newPass) {
        if (passwords.newPass !== passwords.confirm) {
          setError('New passwords do not match!'); setSaving(false); return;
        }
        payload.password = passwords.newPass;
      }
      const res = await fetch(`${AUTH_API}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setPasswords({ current: '', newPass: '', confirm: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) { setError('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleDarkMode = (val) => {
    setDarkMode(val);
    localStorage.setItem('darkMode', val);
    document.documentElement.classList.toggle('dark', val);
  };

  const handleNotifications = (val) => {
    setNotifications(val);
    localStorage.setItem('notifications', val);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${AUTH_API}/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        logout();
        navigate('/');
      }
    } catch (err) { setError('Failed to delete account'); }
  };

  const sections = [
    { id: 'profile', label: 'Edit Profile', icon: '👤' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">⚙️ Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-fit">
          <div className="space-y-1">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeSection === s.id
                    ? 'bg-gradient-to-r from-blue-800 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                } ${s.id === 'danger' ? activeSection !== s.id ? 'text-red-500 hover:bg-red-50' : '' : ''}`}>
                <span className="text-xl">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">

          {/* Success/Error */}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">✅ {success}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">❌ {error}</div>}

          {/* Edit Profile */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">👤 Edit Profile</h2>

              {/* Photo Upload */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                <div className="relative">
                  {profile.photo ? (
                    <img src={profile.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-800 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {profile.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{profile.name}</p>
                  <p className="text-gray-500 text-sm mb-3">{user?.role}</p>
                  <label className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium cursor-pointer transition-all">
                    📷 Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {profile.photo && (
                    <button onClick={() => setProfile(p => ({ ...p, photo: '' }))}
                      className="ml-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all">
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="text" placeholder="+94 77 123 4567" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* Change Password */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">🔒 Change Password</h3>
                  <div className="space-y-3">
                    <input type="password" placeholder="New Password" value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="password" placeholder="Confirm New Password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <button onClick={handleSaveProfile} disabled={saving}
                  className="w-full py-3 bg-gradient-to-r from-blue-800 to-orange-600 hover:from-blue-900 hover:to-orange-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg">
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">🎨 Appearance</h2>
              <div className="space-y-4">
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{darkMode ? '🌙' : '☀️'}</span>
                    <div>
                      <p className="font-semibold text-gray-800">Dark Mode</p>
                      <p className="text-gray-500 text-sm">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDarkMode(!darkMode)}
                    className={`relative w-14 h-7 rounded-full transition-all ${darkMode ? 'bg-blue-800' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${darkMode ? 'left-7' : 'left-0.5'}`}></span>
                  </button>
                </div>

                {/* Theme Preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => handleDarkMode(false)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${!darkMode ? 'border-blue-800 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="bg-white rounded-lg p-3 shadow-sm mb-2">
                      <div className="h-2 bg-gray-200 rounded mb-1 w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center">☀️ Light Mode</p>
                    {!darkMode && <p className="text-xs text-blue-700 text-center mt-1">✓ Active</p>}
                  </div>
                  <div onClick={() => handleDarkMode(true)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${darkMode ? 'border-blue-800 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="bg-gray-800 rounded-lg p-3 shadow-sm mb-2">
                      <div className="h-2 bg-gray-600 rounded mb-1 w-3/4"></div>
                      <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center">🌙 Dark Mode</p>
                    {darkMode && <p className="text-xs text-blue-700 text-center mt-1">✓ Active</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">🔔 Notifications</h2>
              <div className="space-y-4">
                {[
                  { id: 'all', label: 'All Notifications', desc: 'Enable or disable all notifications', icon: '🔔' },
                  { id: 'vacancy', label: 'New Vacancies', desc: 'Get notified when new internships are posted', icon: '💼' },
                  { id: 'application', label: 'Application Updates', desc: 'Updates on your internship applications', icon: '📋' },
                  { id: 'material', label: 'New Study Materials', desc: 'Get notified when new materials are uploaded', icon: '📚' },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{item.label}</p>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotifications(!notifications)}
                      className={`relative w-14 h-7 rounded-full transition-all ${notifications ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${notifications ? 'left-7' : 'left-0.5'}`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
              <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ Danger Zone</h2>
              <p className="text-gray-500 text-sm mb-6">These actions are irreversible. Please be careful!</p>

              <div className="space-y-4">
                {/* Delete Account */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-red-700">Delete Account</p>
                      <p className="text-red-500 text-sm mt-1">Permanently delete your account and all data. This cannot be undone!</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all ml-4 shrink-0">
                      🗑️ Delete Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Confirm Modal */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">⚠️</div>
                      <h3 className="text-xl font-bold text-gray-800">Delete Account?</h3>
                      <p className="text-gray-500 mt-2">This will permanently delete your account and all your data including CV, applications, and profile. This action cannot be undone!</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all">
                        Cancel
                      </button>
                      <button onClick={handleDeleteAccount}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all">
                        Yes, Delete!
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
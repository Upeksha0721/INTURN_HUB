import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Side - Image */}
      <div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6 border border-white/20">
            🎓
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
          <p className="text-indigo-200 text-lg mb-8 max-w-sm">
            Log in to continue your internship journey with InternHub
          </p>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { value: '50+', label: 'Companies' },
              { value: '200+', label: 'Students' },
              { value: '100+', label: 'Internships' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-indigo-300 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-sm mx-auto text-left">
            <p className="text-indigo-100 text-sm italic mb-3">
              "InternHub helped me land my dream internship at a top tech company in Colombo!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">S</div>
              <div>
                <div className="text-white text-sm font-medium">Samanali P.</div>
                <div className="text-indigo-300 text-xs">Software Engineering, SLIIT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-4xl mb-2">🎓</div>
            <h1 className="text-2xl font-bold text-white">InternHub</h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
            <p className="text-gray-400">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">📧</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <span className="text-indigo-400 text-xs hover:text-indigo-300 cursor-pointer">Forgot password?</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : 'Login →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Register here
            </Link>
          </p>

          {/* Back to home */}
          <p className="text-center mt-4">
            <Link to="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
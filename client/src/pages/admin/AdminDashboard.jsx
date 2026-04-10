import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';

const AUTH_API    = 'http://localhost:5001/api/auth';
const STUDY_API   = 'http://localhost:5003/api/study-materials';
const VACANCY_API = 'http://localhost:5002/api/vacancies';
const CV_STATS_API= 'http://localhost:5001/api/cv/admin/stats';

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) return;
    const duration = 800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, path, navigate }) {
  return (
    <div onClick={() => navigate(path)}
      className="relative bg-white rounded-2xl p-5 cursor-pointer overflow-hidden"
      style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.25s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${color}22`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: color }}></div>
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 -mr-6 -mt-6" style={{ background: color }}></div>
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}12` }}>
          {icon}
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${color}12`, color }}>
          View →
        </span>
      </div>
      <div className="text-4xl font-black tracking-tight mb-1" style={{ color }}>
        <Counter value={value} />
      </div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color || '#fff' }}>{p.name}: {p.value}</p>)}
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, badge }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-base font-bold text-slate-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {badge && <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full">{badge}</span>}
    </div>
  );
}

// ─── Service Dot ─────────────────────────────────────────────────────────────
function ServiceRow({ label, port, ok = true }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-400' : 'bg-red-400'}`}
          style={{ boxShadow: ok ? '0 0 6px #34d399' : '0 0 6px #f87171' }}></div>
        <span className="text-sm text-slate-700 font-medium">{label}</span>
      </div>
      <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded-md">:{port}</span>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats]       = useState({ students: 0, materials: 0, vacancies: 0, messages: 0 });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData]   = useState({ pie: [], bar: [], monthly: [] });
  const [cvStats, setCvStats]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // All primary fetches in parallel
        const [usersRes, materialsRes, vacancyRes, messagesRes] = await Promise.all([
          fetch(`${AUTH_API}/users`, { headers }),
          fetch(STUDY_API, { headers }),
          fetch(VACANCY_API, { headers }),
          fetch(`http://localhost:5001/api/messages`, { headers }),
        ]);

        const [users, materials, vacancies, messages] = await Promise.all([
          usersRes.json(), materialsRes.json(), vacancyRes.json(), messagesRes.json(),
        ]);

        const students = Array.isArray(users) ? users.filter(u => u.role === 'student') : [];
        const mats     = Array.isArray(materials) ? materials : [];
        const vacs     = Array.isArray(vacancies) ? vacancies : [];
        const msgs     = Array.isArray(messages)  ? messages  : [];

        setStats({
          students: students.length,
          materials: mats.length,
          vacancies: vacs.length,
          messages: msgs.filter(m => !m.isRead).length,
        });

        const PIE_COLORS = ['#1e40af', '#f59e0b', '#0ea5e9', '#f97316'];
        setChartData({
          pie: [
            { name: 'Students',  value: students.length, color: PIE_COLORS[0] },
            { name: 'Vacancies', value: vacs.length,     color: PIE_COLORS[1] },
            { name: 'Materials', value: mats.length,     color: PIE_COLORS[2] },
            { name: 'Messages',  value: msgs.length,     color: PIE_COLORS[3] },
          ],
          bar: [
            { name: 'Students',  count: students.length, fill: PIE_COLORS[0] },
            { name: 'Vacancies', count: vacs.length,     fill: PIE_COLORS[1] },
            { name: 'Materials', count: mats.length,     fill: PIE_COLORS[2] },
            { name: 'Messages',  count: msgs.length,     fill: PIE_COLORS[3] },
          ],
          monthly: Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return {
              month: d.toLocaleString('default', { month: 'short' }),
              students: students.filter(s => {
                const c = new Date(s.createdAt);
                return c.getMonth() === d.getMonth() && c.getFullYear() === d.getFullYear();
              }).length,
            };
          }),
        });

        // CV stats (non-blocking)
        try {
          const cvRes = await fetch(CV_STATS_API, { headers });
          const cvData = await cvRes.json();
          setCvStats(Array.isArray(cvData) ? cvData : []);
        } catch { setCvStats([]); }

        // Recent activity
        const all = [
          ...students.slice(0, 2).map(u => ({ text: `${u.name} registered as student`, time: new Date(u.createdAt) })),
          ...mats.slice(0, 2).map(m => ({ text: `Material "${m.title}" uploaded`, time: new Date(m.createdAt) })),
          ...vacs.slice(0, 2).map(v => ({ text: `Vacancy "${v.title}" at ${v.company}`, time: new Date(v.createdAt) })),
        ].sort((a, b) => b.time - a.time).slice(0, 6)
         .map(a => ({ ...a, timeStr: a.time.toLocaleDateString(), ago: getTimeAgo(a.time) }));
        setActivities(all);

      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <div className="relative w-14 h-14 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center bg-white rounded-2xl p-8 border border-red-100 shadow-sm max-w-sm">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-slate-700 font-semibold mb-1">Something went wrong</p>
        <p className="text-slate-400 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold">Retry</button>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Students',   value: stats.students,  icon: '🎓', color: '#1e40af', path: '/admin/users' },
    { label: 'Active Vacancies', value: stats.vacancies, icon: '💼', color: '#d97706', path: '/admin/vacancies' },
    { label: 'Study Materials',  value: stats.materials, icon: '📚', color: '#0ea5e9', path: '/admin/upload-material' },
    { label: 'Unread Messages',  value: stats.messages,  icon: '✉️', color: '#f97316', path: '/admin/messages' },

  ];

  const quickActions = [
    { label: 'Post Vacancy',     icon: '➕', bg: '#1e40af', path: '/admin/post-vacancy' },
    { label: 'Manage Users',     icon: '👥', bg: '#f59e0b', path: '/admin/users' },
    { label: 'Upload Material',  icon: '📤', bg: '#0ea5e9', path: '/admin/upload-material' },
    { label: 'View Messages',    icon: '📬', bg: '#f97316', path: '/admin/messages' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', minHeight: 160 }}>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        {/* Glow blobs */}
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}></div>
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-8 py-8 flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2">Admin Control Panel</p>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">
              Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-blue-300 text-sm">Here's what's happening across InternHub today.</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-bold text-sm">{user?.name}</p>
              <p className="text-amber-400 text-xs font-semibold">Administrator</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-10 -mt-5">

        {/* ── Stat Cards (overlap hero) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(c => <StatCard key={c.label} {...c} navigate={navigate} />)}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

          {/* Bar chart — spans 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6" style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <SectionHeader title="System Overview" subtitle="Total count per category" />
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={chartData.bar} barSize={38} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)', radius: 8 }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} name="Count">
                  {chartData.bar.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — spans 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6" style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <SectionHeader title="Distribution" subtitle="Percentage breakdown" />
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={chartData.pie} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {chartData.pie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {chartData.pie.map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.color }}></div>
                  <span className="text-xs text-slate-500 truncate">{e.name}</span>
                  <span className="text-xs font-bold text-slate-700 ml-auto">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Monthly Registrations ── */}
        <div className="bg-white rounded-2xl p-6 mb-5" style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <SectionHeader title="Student Registrations" subtitle="Monthly sign-ups over last 6 months" badge="Last 6 months" />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="students" stroke="#1d4ed8" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: '#1d4ed8', r: 4, strokeWidth: 2, stroke: '#fff' }} name="Students" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Quick Actions + Activity + Services ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <SectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3 mb-6">
              {quickActions.map(a => (
                <button key={a.label} onClick={() => navigate(a.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all font-medium text-white text-xs"
                  style={{ background: a.bg, boxShadow: `0 4px 14px ${a.bg}40` }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${a.bg}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 14px ${a.bg}40`; }}>
                  <span className="text-2xl">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Service Status</p>
              <ServiceRow label="Auth Service"    port="5001" />
              <ServiceRow label="Vacancy Service" port="5002" />
              <ServiceRow label="Study Service"   port="5003" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6" style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <SectionHeader title="Recent Activity" subtitle="Latest events across the platform" badge={`${activities.length} updates`} />
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <span className="text-4xl mb-3">📭</span>
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-1">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-100 transition-all">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium truncate">{a.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.ago} · {a.timeStr}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CV Downloads Table ── */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <SectionHeader
            title="📄 CV Downloads"
            subtitle="Students who have downloaded their CV"
            badge={`${cvStats.length} students`}
          />

          {cvStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-400">
              <span className="text-4xl mb-3">📄</span>
              <p className="text-sm font-medium">No CV downloads yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '2px solid #f8fafc' }}>
                    {['Student', 'Email', 'Downloads', 'Last Downloaded', 'Joined'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cvStats.map((cv, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
                            style={{ background: 'linear-gradient(135deg, #1e40af, #f59e0b)' }}>
                            {(cv.userId?.name || cv.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">{cv.userId?.name || cv.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-sm">{cv.userId?.email || '—'}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">
                          ⬇ {cv.downloadCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-sm">
                        {cv.lastDownloaded
                          ? `${new Date(cv.lastDownloaded).toLocaleDateString()} ${new Date(cv.lastDownloaded).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-sm">
                        {cv.userId?.createdAt
                          ? new Date(cv.userId.createdAt).toLocaleDateString()
                          : cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function getTimeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
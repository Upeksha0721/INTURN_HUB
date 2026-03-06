import { useState, useEffect } from 'react';
import axios from 'axios';

const STUDY_API = 'http://localhost:5003/api/study-materials';

export default function UploadMaterial() {
  const [form, setForm] = useState({ title: '', description: '', category: '', fileUrl: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(STUDY_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Material uploaded successfully! ✅');
        setForm({ title: '', description: '', category: '', fileUrl: '' });
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to connect to study material service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: T.pageBg, padding: '2rem', transition: 'background 0.3s, color 0.3s' }}>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. React.js Fundamentals"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
          </div>
          <div>
            <h1 style={{ color: T.text, fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.4px' }}>Study Materials</h1>
            <p style={{ color: T.textSub, margin: 0, fontSize: '0.875rem' }}>Upload and manage resources for students</p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button onClick={() => setDarkMode(!d)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.2rem', background: T.card, border: `1.5px solid ${T.cardBorder}`, borderRadius: '50px', cursor: 'pointer', color: T.text, fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', boxShadow: '0 2px 6px rgba(0,0,0,0.07)', transition: 'all 0.2s' }}>
          <span>{d ? '☀️' : '🌙'}</span> {d ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.8rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Materials', value: materials.length, icon: '📖', accent: '#7c3aed' },
          { label: 'Categories', value: [...new Set(materials.map(m => m.category))].length, icon: '🏷️', accent: '#0369a1' },
        ].map((s, i) => (
          <div key={i} style={{ background: T.card, border: `1.5px solid ${T.cardBorder}`, borderRadius: '14px', padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${s.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem' }}>{s.icon}</div>
            <div>
              <div style={{ color: T.text, fontWeight: 800, fontSize: '1.4rem', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ color: T.textSub, fontSize: '0.75rem', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Material'}
          </button>
        ))}
      </div>

      {/* ── Upload Tab ── */}
      {tab === 'upload' && (
        <div style={{ maxWidth: 640, margin: '0 auto', background: T.card, border: `1.5px solid ${T.cardBorder}`, borderRadius: '18px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: T.text, fontSize: '1.1rem', fontWeight: 700, marginTop: 0, marginBottom: '1.4rem', paddingBottom: '1rem', borderBottom: `1px solid ${T.cardBorder}` }}>Add New Study Material</h2>

          {success && (
            <div style={{ background: d ? 'rgba(34,197,94,0.12)' : '#f0fdf4', border: `1.5px solid ${d ? 'rgba(34,197,94,0.25)' : '#bbf7d0'}`, color: d ? '#4ade80' : '#15803d', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1.2rem', fontSize: '0.875rem', fontWeight: 600 }}>
              ✅ {success}
            </div>
          )}
          {error && (
            <div style={{ background: d ? 'rgba(239,68,68,0.12)' : '#fef2f2', border: `1.5px solid ${d ? 'rgba(239,68,68,0.25)' : '#fecaca'}`, color: d ? '#f87171' : '#dc2626', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1.2rem', fontSize: '0.875rem', fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {[
              { label: 'Title', key: 'title', type: 'text', placeholder: 'e.g. React.js Fundamentals' },
              { label: 'File URL or Link', key: 'fileUrl', type: 'url', placeholder: 'https://drive.google.com/...' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', color: T.textLabel, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label} *</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required style={inputStyle} />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', color: T.textLabel, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select a category...</option>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', color: T.textLabel, fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description *</label>
              <textarea placeholder="Describe what students will learn..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '0.9rem', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: '11px', color: '#fff', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: loading ? 'none' : '0 4px 14px rgba(124,58,237,0.35)', marginTop: '0.4rem' }}>
              {loading ? '⏳ Uploading...' : '📤 Upload Material'}
            </button>
          </form>
        </div>
      )}

      {/* ── Manage Tab ── */}
      {tab === 'manage' && (
        <div style={{ background: T.card, border: `1.5px solid ${T.cardBorder}`, borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          {materials.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: T.textSub }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: T.text, margin: '0 0 0.25rem' }}>No materials yet</p>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Switch to the Upload tab to add your first material</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: T.headBg, borderBottom: `2px solid ${T.cardBorder}` }}>
                    {['#', 'Title', 'Category', 'Description', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '0.9rem 1.2rem', textAlign: 'left', color: T.textSub, fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, i) => {
                    const cat = getCat(m.category);
                    const isEditing = editingId === m._id;
                    return (
                      <tr key={m._id} style={{ background: i % 2 === 0 ? T.card : T.tableAlt, borderBottom: `1px solid ${T.rowBorder}` }}>
                        <td style={{ padding: '0.9rem 1.2rem', color: T.textSub, fontWeight: 600, fontSize: '0.8rem' }}>{i + 1}</td>

                        {isEditing ? (
                          <>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} style={{ ...inputStyle, padding: '0.5rem 0.7rem', fontSize: '0.85rem', minWidth: 140 }} />
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={{ ...inputStyle, padding: '0.5rem 0.7rem', fontSize: '0.85rem', width: 'auto', minWidth: 130 }}>
                                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                              </select>
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <input value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} style={{ ...inputStyle, padding: '0.5rem 0.7rem', fontSize: '0.85rem', minWidth: 180 }} />
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button onClick={() => handleEditSave(m._id)} style={{ padding: '0.48rem 1rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}>✓ Save</button>
                                <button onClick={() => setEditingId(null)} style={{ padding: '0.48rem 1rem', background: T.mutedBtn, border: `1px solid ${T.cardBorder}`, borderRadius: '8px', color: T.mutedBtnText, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✕ Cancel</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '0.9rem 1.2rem', color: T.text, fontWeight: 700, maxWidth: 200 }}>{m.title}</td>
                            <td style={{ padding: '0.9rem 1.2rem' }}>
                              <span style={{ background: d ? cat.darkBg : cat.lightBg, color: cat.color, padding: '0.28rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                {cat.label}
                              </span>
                            </td>
                            <td style={{ padding: '0.9rem 1.2rem', color: T.textSub, maxWidth: 260 }}>
                              {m.description?.slice(0, 60)}{m.description?.length > 60 ? '...' : ''}
                            </td>
                            <td style={{ padding: '0.9rem 1.2rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => { setEditingId(m._id); setEditForm({ title: m.title, category: m.category, description: m.description, fileUrl: m.fileUrl }); }}
                                  style={{ padding: '0.48rem 1rem', background: d ? 'rgba(99,102,241,0.15)' : '#eef2ff', border: `1.5px solid ${d ? 'rgba(99,102,241,0.35)' : '#c7d2fe'}`, borderRadius: '8px', color: d ? '#818cf8' : '#4338ca', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(m._id)}
                                  style={{ padding: '0.48rem 1rem', background: d ? 'rgba(239,68,68,0.12)' : '#fef2f2', border: `1.5px solid ${d ? 'rgba(239,68,68,0.3)' : '#fecaca'}`, borderRadius: '8px', color: d ? '#f87171' : '#dc2626', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

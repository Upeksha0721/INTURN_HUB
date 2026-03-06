import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadMaterial() {
  const [form, setForm] = useState({ title: '', description: '', category: '', fileUrl: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [tab, setTab] = useState('upload');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('http://localhost:5003/api/study-materials');
      setMaterials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5003/api/study-materials', form);
      setSuccess('Material uploaded successfully!');
      setForm({ title: '', description: '', category: '', fileUrl: '' });
      fetchMaterials();
    } catch (err) {
      setError('Failed to upload material.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axios.delete(`http://localhost:5003/api/study-materials/${id}`);
      setMaterials(materials.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to delete material.');
    }
  };

  const handleEditSave = async (id) => {
    try {
      await axios.put(`http://localhost:5003/api/study-materials/${id}`, editForm);
      setEditingId(null);
      fetchMaterials();
    } catch (err) {
      alert('Failed to update material.');
    }
  };

  const categories = [
    { value: 'uiux', label: 'UI/UX Design', color: '#7c3aed', lightBg: '#f3e8ff', darkBg: 'rgba(124,58,237,0.2)' },
    { value: 'frontend', label: 'Frontend', color: '#0369a1', lightBg: '#e0f2fe', darkBg: 'rgba(3,105,161,0.2)' },
    { value: 'backend', label: 'Backend', color: '#166534', lightBg: '#dcfce7', darkBg: 'rgba(22,101,52,0.2)' },
    { value: 'qa', label: 'QA Engineering', color: '#c2410c', lightBg: '#fff7ed', darkBg: 'rgba(194,65,12,0.2)' },
    { value: 'database', label: 'Database', color: '#854d0e', lightBg: '#fef9c3', darkBg: 'rgba(133,77,14,0.2)' },
    { value: 'devops', label: 'DevOps', color: '#475569', lightBg: '#f1f5f9', darkBg: 'rgba(71,85,105,0.2)' },
    { value: 'other', label: 'Other', color: '#9d174d', lightBg: '#fce7f3', darkBg: 'rgba(157,23,77,0.2)' },
  ];

  const getCat = (val) => categories.find(c => c.value === val) || { label: val, color: '#6b7280', lightBg: '#f3f4f6', darkBg: 'rgba(107,114,128,0.2)' };

  const d = darkMode;
  const T = {
    pageBg:       d ? '#0f172a' : '#f8fafc',
    card:         d ? '#1e293b' : '#ffffff',
    cardBorder:   d ? '#334155' : '#e2e8f0',
    text:         d ? '#f1f5f9' : '#111827',
    textSub:      d ? '#94a3b8' : '#6b7280',
    textLabel:    d ? '#cbd5e1' : '#374151',
    inputBg:      d ? '#0f172a'  : '#ffffff',
    inputBorder:  d ? '#334155' : '#d1d5db',
    inputText:    d ? '#f1f5f9' : '#111827',
    tableAlt:     d ? '#172033' : '#f9fafb',
    rowBorder:    d ? '#1e293b' : '#f3f4f6',
    headBg:       d ? '#162032' : '#f8fafc',
    mutedBtn:     d ? '#273548' : '#f1f5f9',
    mutedBtnText: d ? '#94a3b8' : '#6b7280',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.78rem 1rem',
    background: T.inputBg,
    border: `1.5px solid ${T.inputBorder}`,
    borderRadius: '10px',
    color: T.inputText,
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: T.pageBg, padding: '2rem', transition: 'background 0.3s, color 0.3s' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: 46, height: 46, borderRadius: '13px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}>📚</div>
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
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: T.card, border: `1.5px solid ${T.cardBorder}`, borderRadius: '12px', padding: '0.35rem', width: 'fit-content' }}>
        {[
          { key: 'upload', label: '➕ Upload New' },
          { key: 'manage', label: `📋 Manage (${materials.length})` },
        ].map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)} style={{ padding: '0.58rem 1.3rem', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.2s', background: tab === tb.key ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent', color: tab === tb.key ? '#ffffff' : T.textSub, boxShadow: tab === tb.key ? '0 3px 10px rgba(124,58,237,0.3)' : 'none' }}>
            {tb.label}
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
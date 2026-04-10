import { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CV_API = 'http://localhost:5001/api/cv';

const emptyCV = {
  name: '', email: '', phone: '', address: '', linkedin: '',
  objective: '', photo: '',
  education: [{ degree: '', institution: '', year: '', gpa: '' }],
  experience: [{ title: '', company: '', duration: '', description: '' }],
  skills: '', softSkills: '',
  projects: [{ name: '', description: '', tech: '' }],
  certifications: [{ name: '', institution: '', year: '' }],
  references: [{ name: '', designation: '', organization: '', contact: '' }],
};

// ─── Validation ──────────────────────────────────────────────────────────────
function validateCV(cv) {
  const errors = {};
  if (!cv.name.trim()) errors.name = 'Full name is required';
  else if (cv.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!cv.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.email)) errors.email = 'Invalid email address';
  if (!cv.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(cv.phone)) errors.phone = 'Invalid phone number';
  if (cv.linkedin && !/^(https?:\/\/)?(www\.)?linkedin\.com\/.+/.test(cv.linkedin))
    errors.linkedin = 'Invalid LinkedIn URL';
  return errors;
}

// ─── TEMPLATE 1: Classic ─────────────────────────────────────────────────────
function ClassicTemplate({ cv, accentColor }) {
  const sec = {
    fontSize: '11px', fontWeight: '700', color: accentColor,
    textTransform: 'uppercase', letterSpacing: '2px',
    borderBottom: `1.5px solid ${accentColor}`, paddingBottom: '4px',
    marginBottom: '10px', display: 'block',
  };
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#fff', width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      <div style={{ background: accentColor, padding: '32px 40px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        {cv.photo && <img src={cv.photo} alt="" style={{ width: '82px', height: '82px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', objectFit: 'cover', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700', margin: '0 0 6px', letterSpacing: '0.5px' }}>{cv.name || 'Your Name'}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {cv.email    && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>✉ {cv.email}</span>}
            {cv.phone    && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>☎ {cv.phone}</span>}
            {cv.address  && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>⌂ {cv.address}</span>}
            {cv.linkedin && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>in {cv.linkedin}</span>}
          </div>
        </div>
      </div>
      <div style={{ padding: '28px 40px' }}>
        {cv.objective && <div style={{ marginBottom: '18px' }}><h2 style={sec}>Career Objective</h2><p style={{ fontSize: '11.5px', color: '#444', lineHeight: '1.75', margin: 0, textAlign: 'justify' }}>{cv.objective}</p></div>}
        {cv.education.some(e => e.degree) && <div style={{ marginBottom: '18px' }}><h2 style={sec}>Education</h2>{cv.education.filter(e => e.degree).map((edu, i) => (<div key={i} style={{ marginBottom: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><p style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{edu.degree}</p><p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{edu.year}</p></div><p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}>{edu.institution}</p>{edu.gpa && <p style={{ fontSize: '11px', color: accentColor, margin: 0 }}>GPA: {edu.gpa}</p>}</div>))}</div>}
        {cv.experience.some(e => e.title) && <div style={{ marginBottom: '18px' }}><h2 style={sec}>Experience</h2>{cv.experience.filter(e => e.title).map((exp, i) => (<div key={i} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: `3px solid ${accentColor}` }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><p style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{exp.title}</p><p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{exp.duration}</p></div><p style={{ fontSize: '11px', color: accentColor, fontWeight: '600', margin: '2px 0' }}>{exp.company}</p>{exp.description && <p style={{ fontSize: '11px', color: '#555', margin: '4px 0', lineHeight: '1.65', textAlign: 'justify' }}>{exp.description}</p>}</div>))}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
          {cv.skills && <div><h2 style={sec}>Technical Skills</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>{cv.skills.split(',').map((s, i) => (<span key={i} style={{ padding: '3px 9px', background: `${accentColor}18`, color: accentColor, borderRadius: '3px', fontSize: '10.5px', border: `1px solid ${accentColor}30` }}>{s.trim()}</span>))}</div></div>}
          {cv.softSkills && <div><h2 style={sec}>Soft Skills</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>{cv.softSkills.split(',').map((s, i) => (<span key={i} style={{ padding: '3px 9px', background: '#f5f5f5', color: '#444', borderRadius: '3px', fontSize: '10.5px', border: '1px solid #ddd' }}>{s.trim()}</span>))}</div></div>}
        </div>
        {cv.projects.some(p => p.name) && <div style={{ marginBottom: '18px' }}><h2 style={sec}>Projects</h2>{cv.projects.filter(p => p.name).map((proj, i) => (<div key={i} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: `3px solid #e5e5e5` }}><p style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{proj.name}</p>{proj.tech && <p style={{ fontSize: '11px', color: accentColor, margin: '2px 0' }}>Stack: {proj.tech}</p>}{proj.description && <p style={{ fontSize: '11px', color: '#555', margin: '2px 0', textAlign: 'justify' }}>{proj.description}</p>}</div>))}</div>}
        {cv.certifications?.some(c => c.name) && <div style={{ marginBottom: '18px' }}><h2 style={sec}>Certifications</h2>{cv.certifications.filter(c => c.name).map((cert, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><div><p style={{ fontSize: '11.5px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{cert.name}</p><p style={{ fontSize: '11px', color: '#666', margin: '1px 0' }}>{cert.institution}</p></div><p style={{ fontSize: '11px', color: accentColor, margin: 0 }}>{cert.year}</p></div>))}</div>}
        {cv.references?.some(r => r.name) && <div><h2 style={sec}>References</h2><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{cv.references.filter(r => r.name).map((ref, i) => (<div key={i} style={{ padding: '10px 12px', border: '1px solid #eee', borderRadius: '6px', borderLeft: `3px solid ${accentColor}` }}><p style={{ fontSize: '11.5px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{ref.name}</p><p style={{ fontSize: '11px', color: accentColor, margin: '2px 0' }}>{ref.designation}</p><p style={{ fontSize: '11px', color: '#666', margin: '1px 0' }}>{ref.organization}</p><p style={{ fontSize: '11px', color: '#999', margin: 0 }}>{ref.contact}</p></div>))}</div></div>}
      </div>
    </div>
  );
}

// ─── TEMPLATE 2: Modern Sidebar ──────────────────────────────────────────────
function ModernTemplate({ cv, accentColor }) {
  return (
    <div style={{ fontFamily: "'Arial', sans-serif", background: '#fff', width: '210mm', minHeight: '297mm', boxSizing: 'border-box', display: 'flex' }}>
      <div style={{ width: '34%', background: '#1a1a2e', padding: '28px 18px', boxSizing: 'border-box', flexShrink: 0 }}>
        {cv.photo && <div style={{ textAlign: 'center', marginBottom: '14px' }}><img src={cv.photo} alt="" style={{ width: '88px', height: '88px', borderRadius: '50%', border: `3px solid ${accentColor}`, objectFit: 'cover' }} /></div>}
        <h1 style={{ color: '#fff', fontSize: '15px', fontWeight: '700', margin: '0 0 2px', textAlign: 'center', lineHeight: '1.3' }}>{cv.name || 'Your Name'}</h1>
        <div style={{ height: '1px', background: accentColor, margin: '12px 0', opacity: 0.6 }}></div>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ color: accentColor, fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 7px' }}>Contact</h3>
          {cv.email    && <p style={{ color: '#aab', fontSize: '9.5px', margin: '4px 0', wordBreak: 'break-all' }}>✉ {cv.email}</p>}
          {cv.phone    && <p style={{ color: '#aab', fontSize: '9.5px', margin: '4px 0' }}>☎ {cv.phone}</p>}
          {cv.address  && <p style={{ color: '#aab', fontSize: '9.5px', margin: '4px 0' }}>⌂ {cv.address}</p>}
          {cv.linkedin && <p style={{ color: '#aab', fontSize: '9.5px', margin: '4px 0', wordBreak: 'break-all' }}>in {cv.linkedin}</p>}
        </div>
        {cv.skills && <div style={{ marginBottom: '14px' }}>
          <h3 style={{ color: accentColor, fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 7px' }}>Technical Skills</h3>
          {cv.skills.split(',').map((s, i) => <p key={i} style={{ color: '#ccd', fontSize: '9.5px', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '4px', height: '4px', borderRadius: '50%', background: accentColor, display: 'inline-block', flexShrink: 0 }}></span>{s.trim()}</p>)}
        </div>}
        {cv.softSkills && <div style={{ marginBottom: '14px' }}>
          <h3 style={{ color: accentColor, fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 7px' }}>Soft Skills</h3>
          {cv.softSkills.split(',').map((s, i) => <p key={i} style={{ color: '#ccd', fontSize: '9.5px', margin: '4px 0' }}>— {s.trim()}</p>)}
        </div>}
        {cv.certifications?.some(c => c.name) && <div>
          <h3 style={{ color: accentColor, fontSize: '8.5px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 7px' }}>Certifications</h3>
          {cv.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ marginBottom: '8px' }}><p style={{ color: '#dde', fontSize: '9.5px', fontWeight: '700', margin: 0 }}>{cert.name}</p><p style={{ color: '#99a', fontSize: '9px', margin: '1px 0' }}>{cert.institution} · {cert.year}</p></div>)}
        </div>}
      </div>
      <div style={{ flex: 1, padding: '28px 22px', boxSizing: 'border-box' }}>
        {cv.objective && <div style={{ marginBottom: '16px', padding: '10px 14px', background: `${accentColor}10`, borderLeft: `3px solid ${accentColor}`, borderRadius: '0 6px 6px 0' }}><p style={{ fontSize: '11px', color: '#444', lineHeight: '1.7', margin: 0, fontStyle: 'italic', textAlign: 'justify' }}>{cv.objective}</p></div>}
        {cv.education.some(e => e.degree) && <div style={{ marginBottom: '16px' }}><h2 style={{ fontSize: '10px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `1.5px solid ${accentColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Education</h2>{cv.education.filter(e => e.degree).map((edu, i) => (<div key={i} style={{ marginBottom: '8px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: 0 }}>{edu.degree}</p><p style={{ fontSize: '10px', color: '#888', margin: 0 }}>{edu.year}</p></div><p style={{ fontSize: '10.5px', color: '#555', margin: '1px 0' }}>{edu.institution}</p>{edu.gpa && <p style={{ fontSize: '10px', color: accentColor, margin: 0 }}>GPA: {edu.gpa}</p>}</div>))}</div>}
        {cv.experience.some(e => e.title) && <div style={{ marginBottom: '16px' }}><h2 style={{ fontSize: '10px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `1.5px solid ${accentColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Experience</h2>{cv.experience.filter(e => e.title).map((exp, i) => (<div key={i} style={{ marginBottom: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: 0 }}>{exp.title}</p><p style={{ fontSize: '10px', color: '#888', margin: 0 }}>{exp.duration}</p></div><p style={{ fontSize: '10.5px', color: accentColor, fontWeight: '600', margin: '1px 0' }}>{exp.company}</p>{exp.description && <p style={{ fontSize: '10.5px', color: '#555', margin: '3px 0', lineHeight: '1.6', textAlign: 'justify' }}>{exp.description}</p>}</div>))}</div>}
        {cv.projects.some(p => p.name) && <div style={{ marginBottom: '16px' }}><h2 style={{ fontSize: '10px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `1.5px solid ${accentColor}`, paddingBottom: '3px', marginBottom: '8px' }}>Projects</h2>{cv.projects.filter(p => p.name).map((proj, i) => (<div key={i} style={{ marginBottom: '8px', padding: '7px 10px', background: '#f9f9f9', borderRadius: '5px' }}><p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: 0 }}>{proj.name}</p>{proj.tech && <p style={{ fontSize: '10px', color: accentColor, margin: '2px 0' }}>{proj.tech}</p>}{proj.description && <p style={{ fontSize: '10.5px', color: '#555', margin: '2px 0', textAlign: 'justify' }}>{proj.description}</p>}</div>))}</div>}
        {cv.references?.some(r => r.name) && <div><h2 style={{ fontSize: '10px', fontWeight: '700', color: accentColor, textTransform: 'uppercase', letterSpacing: '2px', borderBottom: `1.5px solid ${accentColor}`, paddingBottom: '3px', marginBottom: '8px' }}>References</h2><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>{cv.references.filter(r => r.name).map((ref, i) => (<div key={i} style={{ padding: '8px', background: '#f9f9f9', borderRadius: '5px' }}><p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: 0 }}>{ref.name}</p><p style={{ fontSize: '10px', color: accentColor, margin: '1px 0' }}>{ref.designation}</p><p style={{ fontSize: '10px', color: '#666', margin: '1px 0' }}>{ref.organization}</p><p style={{ fontSize: '10px', color: '#999', margin: 0 }}>{ref.contact}</p></div>))}</div></div>}
      </div>
    </div>
  );
}

// ─── TEMPLATE 3: Minimal ─────────────────────────────────────────────────────
function MinimalTemplate({ cv, accentColor }) {
  const sh = { fontSize: '9px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 8px', display: 'block' };
  return (
    <div style={{ fontFamily: "'Arial', sans-serif", background: '#fff', width: '210mm', minHeight: '297mm', boxSizing: 'border-box', padding: '48px 50px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {cv.photo && <img src={cv.photo} alt="" style={{ width: '70px', height: '70px', borderRadius: '6px', objectFit: 'cover', border: `2px solid ${accentColor}` }} />}
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111', margin: 0, letterSpacing: '-0.5px' }}>{cv.name || 'Your Name'}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            {cv.email   && <p style={{ fontSize: '10px', color: '#777', margin: '2px 0' }}>{cv.email}</p>}
            {cv.phone   && <p style={{ fontSize: '10px', color: '#777', margin: '2px 0' }}>{cv.phone}</p>}
            {cv.address && <p style={{ fontSize: '10px', color: '#777', margin: '2px 0' }}>{cv.address}</p>}
            {cv.linkedin&& <p style={{ fontSize: '10px', color: accentColor, margin: '2px 0' }}>{cv.linkedin}</p>}
          </div>
        </div>
        <div style={{ height: '2px', background: `linear-gradient(90deg, ${accentColor}, transparent)` }}></div>
      </div>
      {cv.objective && <div style={{ marginBottom: '22px' }}><span style={sh}>About</span><p style={{ fontSize: '11.5px', color: '#444', lineHeight: '1.8', margin: 0, textAlign: 'justify' }}>{cv.objective}</p></div>}
      {cv.education.some(e => e.degree) && <div style={{ marginBottom: '22px' }}><span style={sh}>Education</span>{cv.education.filter(e => e.degree).map((edu, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><div><p style={{ fontSize: '12px', fontWeight: '700', color: '#111', margin: 0 }}>{edu.degree}</p><p style={{ fontSize: '11px', color: '#777', margin: '1px 0', fontStyle: 'italic' }}>{edu.institution}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p></div><p style={{ fontSize: '11px', color: accentColor, margin: 0, whiteSpace: 'nowrap' }}>{edu.year}</p></div>))}</div>}
      {cv.experience.some(e => e.title) && <div style={{ marginBottom: '22px' }}><span style={sh}>Experience</span>{cv.experience.filter(e => e.title).map((exp, i) => (<div key={i} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><p style={{ fontSize: '12px', fontWeight: '700', color: '#111', margin: 0 }}>{exp.title} <span style={{ color: accentColor, fontWeight: '400' }}>@ {exp.company}</span></p><p style={{ fontSize: '10.5px', color: '#999', margin: 0, whiteSpace: 'nowrap', marginLeft: '8px' }}>{exp.duration}</p></div>{exp.description && <p style={{ fontSize: '11px', color: '#555', margin: '4px 0', lineHeight: '1.7', textAlign: 'justify' }}>{exp.description}</p>}</div>))}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', marginBottom: '22px' }}>
        {cv.skills && <div><span style={sh}>Technical Skills</span>{cv.skills.split(',').map((s, i) => <p key={i} style={{ fontSize: '11px', color: '#333', margin: '4px 0' }}>· {s.trim()}</p>)}</div>}
        {cv.softSkills && <div><span style={sh}>Soft Skills</span>{cv.softSkills.split(',').map((s, i) => <p key={i} style={{ fontSize: '11px', color: '#333', margin: '4px 0' }}>· {s.trim()}</p>)}</div>}
      </div>
      {cv.projects.some(p => p.name) && <div style={{ marginBottom: '22px' }}><span style={sh}>Projects</span>{cv.projects.filter(p => p.name).map((proj, i) => (<div key={i} style={{ marginBottom: '10px' }}><p style={{ fontSize: '12px', fontWeight: '700', color: '#111', margin: 0 }}>{proj.name}{proj.tech && <span style={{ color: accentColor, fontWeight: '400', fontSize: '11px' }}> — {proj.tech}</span>}</p>{proj.description && <p style={{ fontSize: '11px', color: '#555', margin: '2px 0', textAlign: 'justify' }}>{proj.description}</p>}</div>))}</div>}
      {cv.certifications?.some(c => c.name) && <div style={{ marginBottom: '22px' }}><span style={sh}>Certifications</span>{cv.certifications.filter(c => c.name).map((cert, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><div><p style={{ fontSize: '11.5px', fontWeight: '700', color: '#111', margin: 0 }}>{cert.name}</p><p style={{ fontSize: '10.5px', color: '#777', margin: '1px 0', fontStyle: 'italic' }}>{cert.institution}</p></div><p style={{ fontSize: '10.5px', color: accentColor, margin: 0 }}>{cert.year}</p></div>)}</div>}
      {cv.references?.some(r => r.name) && <div><span style={sh}>References</span><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>{cv.references.filter(r => r.name).map((ref, i) => (<div key={i} style={{ paddingTop: '8px', borderTop: '1px solid #eee' }}><p style={{ fontSize: '11.5px', fontWeight: '700', color: '#111', margin: 0 }}>{ref.name}</p><p style={{ fontSize: '10.5px', color: accentColor, margin: '1px 0' }}>{ref.designation}, {ref.organization}</p><p style={{ fontSize: '10.5px', color: '#999', margin: 0 }}>{ref.contact}</p></div>))}</div></div>}
    </div>
  );
}

function CVDocument({ cv, accentColor, template }) {
  if (template === 'modern') return <ModernTemplate cv={cv} accentColor={accentColor} />;
  if (template === 'minimal') return <MinimalTemplate cv={cv} accentColor={accentColor} />;
  return <ClassicTemplate cv={cv} accentColor={accentColor} />;
}

// ─── Progress ────────────────────────────────────────────────────────────────
function ProgressRing({ pct }) {
  const r = 28, c = 2 * Math.PI * r;
  const color = pct < 40 ? '#f87171' : pct < 70 ? '#fbbf24' : '#34d399';
  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{pct}%</span>
      </div>
    </div>
  );
}

function ProgressBar({ cv }) {
  const fields = [
    { label: 'Name', done: !!cv.name }, { label: 'Email', done: !!cv.email },
    { label: 'Phone', done: !!cv.phone }, { label: 'Address', done: !!cv.address },
    { label: 'Objective', done: !!cv.objective },
    { label: 'Education', done: cv.education.some(e => e.degree) },
    { label: 'Experience', done: cv.experience.some(e => e.title) },
    { label: 'Skills', done: !!cv.skills }, { label: 'Soft Skills', done: !!cv.softSkills },
    { label: 'Projects', done: cv.projects.some(p => p.name) },
    { label: 'Certs', done: cv.certifications?.some(c => c.name) },
    { label: 'References', done: cv.references?.some(r => r.name) },
  ];
  const done = fields.filter(f => f.done).length;
  const pct = Math.round((done / fields.length) * 100);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <ProgressRing pct={pct} />
        <div>
          <p className="text-sm font-bold text-slate-800 mb-0.5">CV Completion</p>
          <p className="text-xs text-slate-400">{done} of {fields.length} sections filled</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {fields.map((f, i) => (
          <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all ${f.done ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
            {f.done ? '✓' : '○'} {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── UI Atoms ────────────────────────────────────────────────────────────────
const inp = "w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-slate-400 transition-all";
const inpErr = "w-full px-3.5 py-2.5 border border-red-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-50 placeholder-red-300 transition-all";

function FieldErr({ msg }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{msg}</p>;
}

function SectionCard({ title, onAdd, addLabel = '+ Add', children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-all">
            {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function RemovableBlock({ onRemove, children }) {
  return (
    <div className="relative p-4 bg-slate-50 rounded-xl border border-slate-100 mb-3 last:mb-0">
      {onRemove && (
        <button onClick={onRemove} className="absolute top-3 right-3 w-6 h-6 bg-red-50 hover:bg-red-100 text-red-500 rounded-full text-sm flex items-center justify-center transition-all font-bold leading-none">×</button>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ─── ATS Checker ─────────────────────────────────────────────────────────────
function ATSTab({ cv, onGoBack }) {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);

  const analyze = () => {
    if (!jd.trim()) return;
    const stopWords = new Set(['the','and','for','are','was','with','this','that','have','from','they','will','your','been','has','but','not','you','all','can','her','him','his','its','may','our','out','per']);
    const jdWords = [...new Set(jd.toLowerCase().replace(/[^a-z0-9\s+#.]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w)))];
    const cvText = [cv.name, cv.objective, cv.skills, cv.softSkills, ...cv.education.map(e => `${e.degree} ${e.institution}`), ...cv.experience.map(e => `${e.title} ${e.company} ${e.description}`), ...cv.projects.map(p => `${p.name} ${p.tech} ${p.description}`), ...cv.certifications.map(c => `${c.name} ${c.institution}`)].join(' ').toLowerCase();
    const techSet = new Set(['react','node','python','java','javascript','sql','mongodb','express','html','css','typescript','angular','vue','aws','docker','git','api','rest','agile','scrum','figma','flutter','kotlin','swift','php','laravel','django','spring','redis','kubernetes','terraform']);
    const matched = jdWords.filter(w => cvText.includes(w));
    const missing = jdWords.filter(w => !cvText.includes(w)).slice(0, 15);
    const score = Math.min(100, Math.round((matched.length / Math.max(jdWords.length, 1)) * 100));
    setResult({ score, matched: matched.length, total: jdWords.length, missing, tech: matched.filter(w => techSet.has(w)) });
  };

  const scoreColor = result ? (result.score >= 70 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444') : '#6b7280';
  const scoreLabel = result ? (result.score >= 70 ? 'Excellent Match' : result.score >= 50 ? 'Good Match' : 'Needs Work') : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-1">ATS Score Checker</h2>
          <p className="text-slate-500 text-sm mb-5">Paste a job description to see how your CV performs against ATS filters.</p>
          {!cv.name && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">Fill in your CV details first.</div>}
          <textarea value={jd} onChange={e => { setJd(e.target.value); setResult(null); }}
            placeholder="Paste the job description here..." rows={12}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-slate-400" />
          <button onClick={analyze} disabled={!jd.trim() || !cv.name}
            className="mt-3 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all disabled:opacity-40 text-sm tracking-wide">
            Analyze Match
          </button>
        </div>
        <div className="bg-slate-900 rounded-2xl p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">ATS Tips</h3>
          {['Use exact keywords from the job description', 'Spell out abbreviations (JavaScript not JS)', 'Include both hard and soft skills', 'Aim for 70%+ match score', 'Tailor your CV for each role'].map((t, i) => (
            <p key={i} className="text-slate-300 text-xs mb-2 flex gap-2"><span className="text-blue-400">→</span>{t}</p>
          ))}
        </div>
      </div>

      <div>
        {!result ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center flex flex-col items-center justify-center h-full shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">🎯</div>
            <h3 className="text-base font-bold text-slate-700 mb-2">Ready to Analyze</h3>
            <p className="text-slate-400 text-sm">Paste a job description and click Analyze.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={`${(result.score / 100) * 326} 326`} strokeLinecap="round" style={{ transition: 'all 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-800">{result.score}%</span>
                  <span className="text-xs text-slate-400">match</span>
                </div>
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white" style={{ background: scoreColor }}>{scoreLabel}</span>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <p className="text-2xl font-black text-emerald-600">{result.matched}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Keywords Matched</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-2xl font-black text-red-500">{result.total - result.matched}</p>
                  <p className="text-xs text-red-500 mt-0.5">Keywords Missing</p>
                </div>
              </div>
            </div>
            {result.tech.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Technical Matches</h3>
                <div className="flex flex-wrap gap-2">{result.tech.map((kw, i) => <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-200">{kw}</span>)}</div>
              </div>
            )}
            {result.missing.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Add These Keywords</h3>
                <p className="text-xs text-slate-400 mb-3">Include these in your CV to improve your score</p>
                <div className="flex flex-wrap gap-2">{result.missing.map((kw, i) => <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-200">{kw}</span>)}</div>
              </div>
            )}
            <button onClick={onGoBack} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all text-sm">
              Go Back & Improve CV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CVBuilder() {
  const [tab, setTab] = useState('builder');
  const [cv, setCv] = useState(emptyCV);
  const [accentColor, setAccentColor] = useState('#1e40af');
  const [template, setTemplate] = useState('classic');
  const [versions, setVersions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const pdfRef = useRef();
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(CV_API, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data) {
          setCv({
            name: data.name || '', email: data.email || '', phone: data.phone || '',
            address: data.address || '', linkedin: data.linkedin || '',
            objective: data.objective || '', photo: data.photo || '',
            education: data.education?.length ? data.education : emptyCV.education,
            experience: data.experience?.length ? data.experience : emptyCV.experience,
            skills: data.skills || '', softSkills: data.softSkills || '',
            projects: data.projects?.length ? data.projects : emptyCV.projects,
            certifications: data.certifications?.length ? data.certifications : emptyCV.certifications,
            references: data.references?.length ? data.references : emptyCV.references,
          });
          setVersions(data.versions || []);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const updateField = useCallback((f, v) => {
    setCv(p => ({ ...p, [f]: v }));
    if (touched[f]) setErrors(e => ({ ...e, [f]: validateCV({ ...cv, [f]: v })[f] }));
  }, [cv, touched]);

  const handleBlur = (f) => {
    setTouched(p => ({ ...p, [f]: true }));
    setErrors(e => ({ ...e, [f]: validateCV(cv)[f] }));
  };

  const arrOp = (key, emptyItem) => ({
    add: () => setCv(p => ({ ...p, [key]: [...p[key], { ...emptyItem }] })),
    remove: (i) => setCv(p => ({ ...p, [key]: p[key].filter((_, idx) => idx !== i) })),
    update: (i, f, v) => { const u = [...cv[key]]; u[i][f] = v; setCv(p => ({ ...p, [key]: u })); },
  });

  const edu = arrOp('education', { degree: '', institution: '', year: '', gpa: '' });
  const exp = arrOp('experience', { title: '', company: '', duration: '', description: '' });
  const proj = arrOp('projects', { name: '', description: '', tech: '' });
  const cert = arrOp('certifications', { name: '', institution: '', year: '' });
  const ref = arrOp('references', { name: '', designation: '', organization: '', contact: '' });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Max 2MB'); return; }
    const img = new Image(), canvas = document.createElement('canvas');
    img.onload = () => { canvas.width = canvas.height = 200; canvas.getContext('2d').drawImage(img, 0, 0, 200, 200); updateField('photo', canvas.toDataURL('image/jpeg', 0.85)); };
    img.src = URL.createObjectURL(file);
  };

  const validateAndProceed = () => {
    const errs = validateCV(cv);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ name: true, email: true, phone: true, linkedin: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const saveCV = async () => {
    if (!validateAndProceed()) return;
    setSaving(true);
    try {
      const res = await fetch(CV_API, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(cv) });
      if (res.ok) { const d = await res.json(); setVersions(d.cv?.versions || []); setSaveMsg('Saved!'); setTimeout(() => setSaveMsg(''), 3000); }
    } catch {}
    setSaving(false);
  };

  const downloadPDF = async () => {
    if (!validateAndProceed()) return;
    setDownloading(true);
    try {
      const el = pdfRef.current;
      el.style.display = 'block';
      await new Promise(r => setTimeout(r, 200));
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fff', logging: false });
      el.style.display = 'none';
      const img = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      const ih = (canvas.height * pw) / canvas.width;
      if (ih > ph) {
        let yo = 0, rem = ih;
        while (rem > 0) { pdf.addImage(img, 'JPEG', 0, -yo, pw, ih); rem -= ph; yo += ph; if (rem > 0) pdf.addPage(); }
      } else pdf.addImage(img, 'JPEG', 0, 0, pw, ih);
      pdf.save(`${cv.name.replace(/\s+/g, '_') || 'My'}_CV.pdf`);
      try { await fetch('http://localhost:5001/api/cv/track-download', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); } catch {}
    } catch (e) {
      if (pdfRef.current) pdfRef.current.style.display = 'none';
      alert('PDF failed: ' + e.message);
    }
    setDownloading(false);
  };

  const loadVersion = (v) => {
    setCv({ name: v.data.name || '', email: v.data.email || '', phone: v.data.phone || '', address: v.data.address || '', linkedin: v.data.linkedin || '', objective: v.data.objective || '', photo: v.data.photo || '', education: v.data.education?.length ? v.data.education : emptyCV.education, experience: v.data.experience?.length ? v.data.experience : emptyCV.experience, skills: v.data.skills || '', softSkills: v.data.softSkills || '', projects: v.data.projects?.length ? v.data.projects : emptyCV.projects, certifications: v.data.certifications?.length ? v.data.certifications : emptyCV.certifications, references: v.data.references?.length ? v.data.references : emptyCV.references });
    setErrors({}); setTouched({});
  };

  const templates = [
    { id: 'classic', name: 'Classic', desc: 'Bold header, clean body' },
    { id: 'modern', name: 'Modern', desc: 'Dark sidebar, minimal right' },
    { id: 'minimal', name: 'Minimal', desc: 'Typography-first, elegant' },
  ];
  const tips = [
    { icon: '📝', t: 'Keep it concise', d: 'Limit to 1-2 pages. Recruiters spend ~7 seconds on first pass.' },
    { icon: '🎯', t: 'Tailor every time', d: 'Use keywords from each specific job description.' },
    { icon: '📊', t: 'Quantify impact', d: 'Numbers stand out. "Reduced load time by 40%" beats "improved performance".' },
    { icon: '✅', t: 'Proofread ruthlessly', d: 'Spelling errors are instant disqualifiers.' },
    { icon: '🔗', t: 'Link your LinkedIn', d: 'Recruiters will check it. Keep it consistent.' },
    { icon: '💼', t: 'Skills > Duties', d: 'Focus on what you achieved, not just what you did.' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center"><div className="text-5xl mb-4 animate-pulse">📄</div><p className="text-slate-500 text-sm">Loading your CV...</p></div>
    </div>
  );

  const tabs = [
    { id: 'builder', label: '✦ Builder' },
    { id: 'ats', label: '◎ ATS Checker' },
    { id: 'templates', label: '▦ Templates' },
    { id: 'tips', label: '◈ Tips' },
  ];

  const presetColors = ['#1e40af', '#0f766e', '#7c3aed', '#be123c', '#b45309', '#0369a1'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hidden PDF renderer */}
      <div ref={pdfRef} style={{ display: 'none', position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }}>
        <CVDocument cv={cv} accentColor={accentColor} template={template} />
      </div>

      {/* Fullscreen preview */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-start justify-center overflow-y-auto py-10" onClick={() => setFullscreen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <button onClick={() => setFullscreen(false)} className="fixed top-5 right-5 w-10 h-10 bg-white rounded-full text-slate-700 hover:bg-slate-100 font-bold text-lg flex items-center justify-center shadow-xl z-50">✕</button>
            <CVDocument cv={cv} accentColor={accentColor} template={template} />
          </div>
        </div>
      )}

      <div className="p-6 lg:p-8 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">CV Builder</h1>
            <p className="text-slate-500 text-sm mt-0.5">Build your professional CV — export as a polished PDF</p>
          </div>
          {saveMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold">{saveMsg}</div>}
        </div>

        {/* Error banner — only show when user has attempted save/download and there are real messages */}
        {(() => {
          const activeErrors = Object.entries(errors).filter(([field, msg]) => msg && touched[field]);
          return activeErrors.length > 0 ? (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
              <span className="text-red-500 text-lg">⚠</span>
              <div>
                <p className="text-red-700 font-semibold text-sm mb-1">Fix these before continuing:</p>
                {activeErrors.map(([, msg], i) => <p key={i} className="text-red-600 text-xs">· {msg}</p>)}
              </div>
            </div>
          ) : null;
        })()}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-slate-200 p-1 rounded-2xl w-fit shadow-sm">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── BUILDER TAB ── */}
        {tab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-5">

              {/* Personal Info */}
              <SectionCard title="Personal Information">
                {/* Photo */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                  {cv.photo ? <img src={cv.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow" />
                    : <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-white text-2xl font-bold shadow">{cv.name?.[0]?.toUpperCase() || '?'}</div>}
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1.5">Profile Photo <span className="font-normal text-slate-400">(optional)</span></p>
                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold cursor-pointer transition-all border border-blue-200">
                        Upload <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                      </label>
                      {cv.photo && <button onClick={() => updateField('photo', '')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold border border-red-200 transition-all">Remove</button>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">JPG/PNG, max 2MB</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <input type="text" placeholder="Full Name *" value={cv.name} onChange={e => updateField('name', e.target.value)} onBlur={() => handleBlur('name')} className={errors.name && touched.name ? inpErr : inp} />
                    <FieldErr msg={touched.name && errors.name} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input type="email" placeholder="Email *" value={cv.email} onChange={e => updateField('email', e.target.value)} onBlur={() => handleBlur('email')} className={errors.email && touched.email ? inpErr : inp} />
                      <FieldErr msg={touched.email && errors.email} />
                    </div>
                    <div>
                      <input type="text" placeholder="Phone * (+94 77 123 4567)" value={cv.phone} onChange={e => updateField('phone', e.target.value)} onBlur={() => handleBlur('phone')} className={errors.phone && touched.phone ? inpErr : inp} />
                      <FieldErr msg={touched.phone && errors.phone} />
                    </div>
                  </div>
                  <input type="text" placeholder="Address" value={cv.address} onChange={e => updateField('address', e.target.value)} className={inp} />
                  <div>
                    <input type="text" placeholder="LinkedIn URL (linkedin.com/in/yourname)" value={cv.linkedin} onChange={e => updateField('linkedin', e.target.value)} onBlur={() => handleBlur('linkedin')} className={errors.linkedin && touched.linkedin ? inpErr : inp} />
                    <FieldErr msg={touched.linkedin && errors.linkedin} />
                  </div>
                </div>
              </SectionCard>

              {/* Objective */}
              <SectionCard title="Career Objective">
                <textarea placeholder="Write a compelling 2-3 sentence career objective..." value={cv.objective} onChange={e => updateField('objective', e.target.value)} rows={3} className={`${inp} resize-none`} />
                <p className="text-xs text-slate-400 mt-1.5 text-right">{cv.objective.length}/500</p>
              </SectionCard>

              {/* Education */}
              <SectionCard title="Education" onAdd={edu.add}>
                {cv.education.map((e, i) => (
                  <RemovableBlock key={i} onRemove={cv.education.length > 1 ? () => edu.remove(i) : null}>
                    <input type="text" placeholder="Degree / Course" value={e.degree} onChange={ev => edu.update(i, 'degree', ev.target.value)} className={inp} />
                    <input type="text" placeholder="Institution / University" value={e.institution} onChange={ev => edu.update(i, 'institution', ev.target.value)} className={inp} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Year (e.g. 2021-2025)" value={e.year} onChange={ev => edu.update(i, 'year', ev.target.value)} className={inp} />
                      <input type="text" placeholder="GPA / Grade" value={e.gpa} onChange={ev => edu.update(i, 'gpa', ev.target.value)} className={inp} />
                    </div>
                  </RemovableBlock>
                ))}
              </SectionCard>

              {/* Experience */}
              <SectionCard title="Work Experience" onAdd={exp.add}>
                {cv.experience.map((e, i) => (
                  <RemovableBlock key={i} onRemove={cv.experience.length > 1 ? () => exp.remove(i) : null}>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Job Title" value={e.title} onChange={ev => exp.update(i, 'title', ev.target.value)} className={inp} />
                      <input type="text" placeholder="Company" value={e.company} onChange={ev => exp.update(i, 'company', ev.target.value)} className={inp} />
                    </div>
                    <input type="text" placeholder="Duration (Jan 2024 - Mar 2024)" value={e.duration} onChange={ev => exp.update(i, 'duration', ev.target.value)} className={inp} />
                    <textarea placeholder="Describe your responsibilities and achievements..." value={e.description} onChange={ev => exp.update(i, 'description', ev.target.value)} rows={2} className={`${inp} resize-none`} />
                  </RemovableBlock>
                ))}
              </SectionCard>

              {/* Skills */}
              <div className="grid grid-cols-2 gap-5">
                <SectionCard title="Technical Skills">
                  <input type="text" placeholder="React, Node.js, Python, SQL..." value={cv.skills} onChange={e => updateField('skills', e.target.value)} className={inp} />
                  {cv.skills && <div className="flex flex-wrap gap-1.5 mt-3">{cv.skills.split(',').filter(s => s.trim()).map((s, i) => <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium">{s.trim()}</span>)}</div>}
                </SectionCard>
                <SectionCard title="Soft Skills">
                  <input type="text" placeholder="Leadership, Teamwork, Communication..." value={cv.softSkills} onChange={e => updateField('softSkills', e.target.value)} className={inp} />
                  {cv.softSkills && <div className="flex flex-wrap gap-1.5 mt-3">{cv.softSkills.split(',').filter(s => s.trim()).map((s, i) => <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium">{s.trim()}</span>)}</div>}
                </SectionCard>
              </div>

              {/* Projects */}
              <SectionCard title="Projects" onAdd={proj.add}>
                {cv.projects.map((p, i) => (
                  <RemovableBlock key={i} onRemove={cv.projects.length > 1 ? () => proj.remove(i) : null}>
                    <input type="text" placeholder="Project Name" value={p.name} onChange={e => proj.update(i, 'name', e.target.value)} className={inp} />
                    <input type="text" placeholder="Technologies Used" value={p.tech} onChange={e => proj.update(i, 'tech', e.target.value)} className={inp} />
                    <textarea placeholder="Brief description..." value={p.description} onChange={e => proj.update(i, 'description', e.target.value)} rows={2} className={`${inp} resize-none`} />
                  </RemovableBlock>
                ))}
              </SectionCard>

              {/* Certifications */}
              <SectionCard title="Courses & Certifications" onAdd={cert.add}>
                {cv.certifications.map((c, i) => (
                  <RemovableBlock key={i} onRemove={cv.certifications.length > 1 ? () => cert.remove(i) : null}>
                    <input type="text" placeholder="Certification Name" value={c.name} onChange={e => cert.update(i, 'name', e.target.value)} className={inp} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Platform / Institution" value={c.institution} onChange={e => cert.update(i, 'institution', e.target.value)} className={inp} />
                      <input type="text" placeholder="Year" value={c.year} onChange={e => cert.update(i, 'year', e.target.value)} className={inp} />
                    </div>
                  </RemovableBlock>
                ))}
              </SectionCard>

              {/* References */}
              <SectionCard title="References" onAdd={ref.add}>
                {cv.references.map((r, i) => (
                  <RemovableBlock key={i} onRemove={cv.references.length > 1 ? () => ref.remove(i) : null}>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Full Name" value={r.name} onChange={e => ref.update(i, 'name', e.target.value)} className={inp} />
                      <input type="text" placeholder="Designation" value={r.designation} onChange={e => ref.update(i, 'designation', e.target.value)} className={inp} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Organization" value={r.organization} onChange={e => ref.update(i, 'organization', e.target.value)} className={inp} />
                      <input type="text" placeholder="Phone / Email" value={r.contact} onChange={e => ref.update(i, 'contact', e.target.value)} className={inp} />
                    </div>
                  </RemovableBlock>
                ))}
              </SectionCard>

              {/* Customize */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Accent Color</h3>
                <div className="flex items-center gap-3">
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                    style={{ width: '38px', height: '38px', borderRadius: '8px', border: '2px solid #e2e8f0', cursor: 'pointer', padding: '2px' }} />
                  <div className="flex gap-2">
                    {presetColors.map(c => (
                      <button key={c} onClick={() => setAccentColor(c)}
                        className={`w-7 h-7 rounded-full transition-all border-2 ${accentColor === c ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={saveCV} disabled={saving}
                  className="flex-1 py-3 bg-white border-2 border-slate-300 hover:border-slate-900 text-slate-700 hover:text-slate-900 font-bold rounded-2xl transition-all disabled:opacity-50 text-sm">
                  {saving ? 'Saving...' : 'Save CV'}
                </button>
                <button onClick={downloadPDF} disabled={downloading}
                  className="flex-[2] py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all disabled:opacity-50 text-sm shadow-lg">
                  {downloading ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating...</span> : 'Download PDF'}
                </button>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="space-y-4">
              <ProgressBar cv={cv} />

              {/* Template picker */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Template</p>
                <div className="grid grid-cols-3 gap-2">
                  {templates.map(t => (
                    <button key={t.id} onClick={() => setTemplate(t.id)}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all ${template === t.id ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}>
                      <p className="text-xs font-bold text-slate-800">{t.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-tight">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400 font-medium">Live Preview</p>
                  <button onClick={() => setFullscreen(true)} className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold transition-all">⛶ Expand</button>
                </div>
                <div style={{ overflow: 'hidden', height: '400px', borderRadius: '8px', position: 'relative', background: '#f8fafc' }}>
                  <div style={{ transform: 'scale(0.42)', transformOrigin: 'top left', width: '238%', pointerEvents: 'none' }}>
                    <CVDocument cv={cv} accentColor={accentColor} template={template} />
                  </div>
                </div>
              </div>

              {/* Versions */}
              {versions.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Saved Versions</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {[...versions].reverse().map((v, i) => (
                      <button key={i} onClick={() => loadVersion(v)}
                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all text-left">
                        <div>
                          <p className="text-xs font-bold text-slate-800">v{v.versionNumber} · {v.data.name || 'Unnamed'}</p>
                          <p className="text-xs text-slate-400">{new Date(v.savedAt).toLocaleDateString()} {new Date(v.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className="text-blue-600 text-xs font-bold">Load →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ATS TAB ── */}
        {tab === 'ats' && <ATSTab cv={cv} onGoBack={() => setTab('builder')} />}

        {/* ── TEMPLATES TAB ── */}
        {tab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(t => (
              <div key={t.id} onClick={() => { setTemplate(t.id); setTab('builder'); }}
                className={`bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all hover:shadow-lg ${template === t.id ? 'border-slate-900 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}>
                <div style={{ height: '200px', overflow: 'hidden', background: '#f8fafc', position: 'relative' }}>
                  <div style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '333%', pointerEvents: 'none' }}>
                    <CVDocument cv={{ name: 'Jane Smith', email: 'jane@email.com', phone: '+94 77 000 0000', address: 'Colombo, LK', linkedin: 'linkedin.com/in/jane', objective: 'A passionate software engineer with experience building scalable web applications.', education: [{ degree: 'BSc Software Engineering', institution: 'SLIIT', year: '2021-2025', gpa: '3.9' }], experience: [{ title: 'Software Intern', company: 'TechCorp', duration: 'Jun-Sep 2024', description: 'Built REST APIs and React dashboards.' }], skills: 'React, Node.js, Python', softSkills: 'Leadership, Communication', projects: [{ name: 'InternHub', tech: 'MERN Stack', description: 'Internship management system.' }], certifications: [{ name: 'AWS Cloud Practitioner', institution: 'Amazon', year: '2024' }], references: [{ name: 'Dr. Perera', designation: 'Lecturer', organization: 'SLIIT', contact: 'perera@sliit.lk' }], photo: '' }} accentColor={accentColor} template={t.id} />
                  </div>
                  {template === t.id && <div className="absolute top-2 right-2 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg font-bold">Active</div>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800">{t.name}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{t.desc}</p>
                  <div className={`mt-3 w-full py-2 rounded-xl text-sm font-bold text-center transition-all ${template === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                    {template === t.id ? 'Currently Active' : 'Select Template'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TIPS TAB ── */}
        {tab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{tip.t}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{tip.d}</p>
              </div>
            ))}
            <div className="md:col-span-2 lg:col-span-3 bg-slate-900 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Pro Tip for InternHub Users</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Use the ATS Checker tab to paste any job description and instantly see how your CV scores — then go back and add the missing keywords before you apply. Even small changes can significantly improve your callback rate.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
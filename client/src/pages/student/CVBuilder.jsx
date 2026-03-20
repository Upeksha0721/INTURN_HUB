import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CV_API = 'http://localhost:5001/api/cv';

export default function CVBuilder() {
  const [activeTab, setActiveTab] = useState('builder');
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadingCV, setLoadingCV] = useState(true);
  const [headerColor, setHeaderColor] = useState('#1e3a8a');
  const cvRef = useRef();
  const token = localStorage.getItem('token');

  const [cv, setCv] = useState({
    name: '', email: '', phone: '', address: '', linkedin: '',
    objective: '',
    education: [{ degree: '', institution: '', year: '', gpa: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    skills: '', softSkills: '',
    projects: [{ name: '', description: '', tech: '' }],
    certifications: [{ name: '', institution: '', year: '' }],
    references: [{ name: '', designation: '', organization: '', contact: '' }],
  });

  useEffect(() => {
    const loadCV = async () => {
      try {
        const res = await fetch(CV_API, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data) {
          setCv({
            name: data.name || '', email: data.email || '', phone: data.phone || '',
            address: data.address || '', linkedin: data.linkedin || '', objective: data.objective || '',
            education: data.education?.length ? data.education : [{ degree: '', institution: '', year: '', gpa: '' }],
            experience: data.experience?.length ? data.experience : [{ title: '', company: '', duration: '', description: '' }],
            skills: data.skills || '', softSkills: data.softSkills || '',
            projects: data.projects?.length ? data.projects : [{ name: '', description: '', tech: '' }],
            certifications: data.certifications?.length ? data.certifications : [{ name: '', institution: '', year: '' }],
            references: data.references?.length ? data.references : [{ name: '', designation: '', organization: '', contact: '' }],
          });
        }
      } catch (err) { console.error('Failed to load CV'); }
      finally { setLoadingCV(false); }
    };
    loadCV();
  }, []);

  const updateField = (f, v) => setCv(p => ({ ...p, [f]: v }));
  const addEducation = () => setCv(p => ({ ...p, education: [...p.education, { degree: '', institution: '', year: '', gpa: '' }] }));
  const addExperience = () => setCv(p => ({ ...p, experience: [...p.experience, { title: '', company: '', duration: '', description: '' }] }));
  const addProject = () => setCv(p => ({ ...p, projects: [...p.projects, { name: '', description: '', tech: '' }] }));
  const addCertification = () => setCv(p => ({ ...p, certifications: [...p.certifications, { name: '', institution: '', year: '' }] }));
  const addReference = () => setCv(p => ({ ...p, references: [...p.references, { name: '', designation: '', organization: '', contact: '' }] }));
  const updateEducation = (i, f, v) => { const u = [...cv.education]; u[i][f] = v; setCv(p => ({ ...p, education: u })); };
  const updateExperience = (i, f, v) => { const u = [...cv.experience]; u[i][f] = v; setCv(p => ({ ...p, experience: u })); };
  const updateProject = (i, f, v) => { const u = [...cv.projects]; u[i][f] = v; setCv(p => ({ ...p, projects: u })); };
  const updateCertification = (i, f, v) => { const u = [...cv.certifications]; u[i][f] = v; setCv(p => ({ ...p, certifications: u })); };
  const updateReference = (i, f, v) => { const u = [...cv.references]; u[i][f] = v; setCv(p => ({ ...p, references: u })); };

  const saveCV = async () => {
    setSaving(true);
    try {
      const res = await fetch(CV_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cv)
      });
      if (res.ok) { setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
    } catch (err) { console.error('Failed to save CV'); }
    finally { setSaving(false); }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const element = cvRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, useCORS: true, allowTaint: false,
        backgroundColor: '#ffffff', logging: false,
        imageTimeout: 0, removeContainer: true, foreignObjectRendering: false,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (pdfHeight > pageHeight) {
        let yOffset = 0;
        let remaining = pdfHeight;
        while (remaining > 0) {
          pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfWidth, pdfHeight);
          remaining -= pageHeight;
          yOffset += pageHeight;
          if (remaining > 0) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      pdf.save(`${cv.name.replace(/\s+/g, '_') || 'My'}_CV.pdf`);
    } catch (err) {
      alert('PDF failed: ' + err.message);
    } finally { setDownloading(false); }
  };

  const S = {
    section: { marginBottom: '14px', width: '100%' },
    heading: { fontSize: '11px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #ea580c', paddingBottom: '3px', marginBottom: '6px', display: 'block', width: '100%' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
    bold11: { fontSize: '11px', fontWeight: 'bold', color: '#1f2937', margin: 0, flex: 1 },
    gray11: { fontSize: '11px', color: '#6b7280', margin: 0, whiteSpace: 'nowrap', marginLeft: '8px' },
    dark11: { fontSize: '11px', color: '#4b5563', margin: '2px 0' },
    orange11: { fontSize: '11px', color: '#ea580c', margin: '2px 0' },
  };

  const templates = [
    { name: 'Professional Blue', color: 'from-blue-800 to-blue-600', desc: 'Clean and corporate style' },
    { name: 'Modern Orange', color: 'from-orange-600 to-orange-400', desc: 'Bold and creative style' },
    { name: 'Classic Dark', color: 'from-gray-800 to-gray-600', desc: 'Traditional professional style' },
  ];

  const tips = [
    { icon: '📝', title: 'Keep it concise', desc: 'Limit your CV to 1-2 pages. Recruiters spend only 6-8 seconds on first review.' },
    { icon: '🎯', title: 'Tailor for each job', desc: 'Customize your CV for each application using keywords from the job description.' },
    { icon: '📊', title: 'Quantify achievements', desc: 'Use numbers to show impact. E.g., "Increased sales by 30%" instead of "Increased sales".' },
    { icon: '✅', title: 'Proofread carefully', desc: 'Spelling mistakes can instantly disqualify you. Always proofread multiple times.' },
    { icon: '🔗', title: 'Add LinkedIn', desc: "Include your LinkedIn profile URL. Make sure it's up to date with your CV." },
    { icon: '💼', title: 'List relevant skills', desc: 'Include both technical and soft skills relevant to the role you are applying for.' },
  ];

  if (loadingCV) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center"><div className="text-4xl mb-4">📄</div><p className="text-gray-500">Loading your CV...</p></div>
    </div>
  );

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📄 CV Builder</h1>
          <p className="text-gray-500 mt-1">Build your professional CV and download as PDF</p>
        </div>
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm">✅ CV saved!</div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {[{ id: 'builder', label: '🛠️ CV Builder' }, { id: 'tips', label: '💡 CV Tips' }, { id: 'templates', label: '📋 Templates' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-800 to-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* FORM */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">👤 Personal Information</h2>
              <div className="space-y-3">
                <input type="text" placeholder="Full Name *" value={cv.name} onChange={e => updateField('name', e.target.value)} className={inputCls.replace('py-2.5', 'py-3')} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="email" placeholder="Email *" value={cv.email} onChange={e => updateField('email', e.target.value)} className={inputCls.replace('py-2.5', 'py-3')} />
                  <input type="text" placeholder="Phone *" value={cv.phone} onChange={e => updateField('phone', e.target.value)} className={inputCls.replace('py-2.5', 'py-3')} />
                </div>
                <input type="text" placeholder="Address" value={cv.address} onChange={e => updateField('address', e.target.value)} className={inputCls.replace('py-2.5', 'py-3')} />
                <input type="text" placeholder="LinkedIn URL" value={cv.linkedin} onChange={e => updateField('linkedin', e.target.value)} className={inputCls.replace('py-2.5', 'py-3')} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 Career Objective</h2>
              <textarea placeholder="Write a brief career objective..." value={cv.objective} onChange={e => updateField('objective', e.target.value)} rows={3} className={`${inputCls.replace('py-2.5', 'py-3')} resize-none`} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">🎓 Education</h2>
                <button onClick={addEducation} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
              </div>
              {cv.education.map((edu, i) => (
                <div key={i} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                  <input type="text" placeholder="Degree / Course" value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className={inputCls} />
                  <input type="text" placeholder="Institution / University" value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Year (e.g. 2021-2025)" value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} className={inputCls} />
                    <input type="text" placeholder="GPA / Grade" value={edu.gpa} onChange={e => updateEducation(i, 'gpa', e.target.value)} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">💼 Experience</h2>
                <button onClick={addExperience} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
              </div>
              {cv.experience.map((exp, i) => (
                <div key={i} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Job Title" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} className={inputCls} />
                    <input type="text" placeholder="Company" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} className={inputCls} />
                  </div>
                  <input type="text" placeholder="Duration (e.g. Jan 2024 - Mar 2024)" value={exp.duration} onChange={e => updateExperience(i, 'duration', e.target.value)} className={inputCls} />
                  <textarea placeholder="Describe your responsibilities..." value={exp.description} onChange={e => updateExperience(i, 'description', e.target.value)} rows={2} className={`${inputCls} resize-none`} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">⚡ Technical Skills</h2>
              <input type="text" placeholder="e.g. React, Node.js, Python (comma separated)" value={cv.skills} onChange={e => updateField('skills', e.target.value)} className={inputCls.replace('py-2.5', 'py-3')} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🤝 Soft Skills</h2>
              <input type="text" placeholder="e.g. Leadership, Communication (comma separated)" value={cv.softSkills} onChange={e => updateField('softSkills', e.target.value)} className={inputCls.replace('py-2.5', 'py-3')} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">🚀 Projects</h2>
                <button onClick={addProject} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
              </div>
              {cv.projects.map((proj, i) => (
                <div key={i} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                  <input type="text" placeholder="Project Name" value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} className={inputCls} />
                  <input type="text" placeholder="Technologies Used" value={proj.tech} onChange={e => updateProject(i, 'tech', e.target.value)} className={inputCls} />
                  <textarea placeholder="Brief description..." value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} rows={2} className={`${inputCls} resize-none`} />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">🏆 Courses & Certifications</h2>
                <button onClick={addCertification} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
              </div>
              {cv.certifications.map((cert, i) => (
                <div key={i} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                  <input type="text" placeholder="Course / Certification Name" value={cert.name} onChange={e => updateCertification(i, 'name', e.target.value)} className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Institution / Platform" value={cert.institution} onChange={e => updateCertification(i, 'institution', e.target.value)} className={inputCls} />
                    <input type="text" placeholder="Year Completed" value={cert.year} onChange={e => updateCertification(i, 'year', e.target.value)} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">👔 References</h2>
                <button onClick={addReference} className="text-blue-600 text-sm font-medium hover:text-blue-700">+ Add</button>
              </div>
              {cv.references.map((ref, i) => (
                <div key={i} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Full Name" value={ref.name} onChange={e => updateReference(i, 'name', e.target.value)} className={inputCls} />
                    <input type="text" placeholder="Designation" value={ref.designation} onChange={e => updateReference(i, 'designation', e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Organization" value={ref.organization} onChange={e => updateReference(i, 'organization', e.target.value)} className={inputCls} />
                    <input type="text" placeholder="Phone / Email" value={ref.contact} onChange={e => updateReference(i, 'contact', e.target.value)} className={inputCls} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={saveCV} disabled={saving || !cv.name}
              className="w-full py-3 bg-white border-2 border-blue-800 text-blue-800 hover:bg-blue-50 font-bold rounded-2xl transition-all disabled:opacity-50">
              {saving ? '⏳ Saving...' : '💾 Save CV'}
            </button>
            <button onClick={downloadPDF} disabled={downloading || !cv.name}
              className="w-full py-4 bg-gradient-to-r from-blue-800 to-orange-600 hover:from-blue-900 hover:to-orange-700 text-white font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50 text-lg">
              {downloading ? '⏳ Generating PDF...' : '⬇️ Download CV as PDF'}
            </button>
          </div>

          {/* CV PREVIEW */}
          <div className="sticky top-6">
            {/* Color Picker Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">👁️ Live Preview</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Header Color:</span>
                <input
                  type="color"
                  value={headerColor}
                  onChange={e => setHeaderColor(e.target.value)}
                  style={{width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer', padding: '2px'}}
                />
              </div>
            </div>

            <div ref={cvRef} style={{fontFamily: 'Arial, sans-serif', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%'}}>

              {/* Header */}
              <div style={{background: headerColor, padding: '24px 32px', width: '100%', boxSizing: 'border-box'}}>
                <h1 style={{color: '#ffffff', fontSize: '22px', fontWeight: 'bold', margin: 0}}>{cv.name || 'Your Name'}</h1>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px'}}>
                  {cv.email && <span style={{color: '#bfdbfe', fontSize: '11px'}}>✉ {cv.email}</span>}
                  {cv.phone && <span style={{color: '#bfdbfe', fontSize: '11px'}}>☎ {cv.phone}</span>}
                  {cv.address && <span style={{color: '#bfdbfe', fontSize: '11px'}}>⌂ {cv.address}</span>}
                  {cv.linkedin && <span style={{color: '#bfdbfe', fontSize: '11px'}}>in {cv.linkedin}</span>}
                </div>
              </div>

              <div style={{padding: '20px 24px', boxSizing: 'border-box', width: '100%'}}>

                {cv.objective && (
                  <div style={S.section}>
                    <h2 style={S.heading}>Career Objective</h2>
                    <p style={{fontSize: '11px', color: '#4b5563', lineHeight: '1.6', margin: 0}}>{cv.objective}</p>
                  </div>
                )}

                {cv.education.some(e => e.degree) && (
                  <div style={S.section}>
                    <h2 style={S.heading}>Education</h2>
                    {cv.education.filter(e => e.degree).map((edu, i) => (
                      <div key={i} style={{marginBottom: '8px'}}>
                        <div style={S.row}>
                          <p style={S.bold11}>{edu.degree}</p>
                          <p style={S.gray11}>{edu.year}</p>
                        </div>
                        <p style={S.dark11}>{edu.institution}</p>
                        {edu.gpa && <p style={S.orange11}>GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {cv.experience.some(e => e.title) && (
                  <div style={S.section}>
                    <h2 style={S.heading}>Experience</h2>
                    {cv.experience.filter(e => e.title).map((exp, i) => (
                      <div key={i} style={{marginBottom: '8px'}}>
                        <div style={S.row}>
                          <p style={S.bold11}>{exp.title}</p>
                          <p style={S.gray11}>{exp.duration}</p>
                        </div>
                        <p style={{...S.orange11, fontWeight: '500'}}>{exp.company}</p>
                        {exp.description && <p style={S.dark11}>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {cv.skills && (
                  <div style={S.section}>
                    <h2 style={S.heading}>Technical Skills</h2>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start'}}>
                      {cv.skills.split(',').map((skill, i) => (
                        <span key={i} style={{padding: '2px 8px', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '10px', display: 'inline-block'}}>{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {cv.softSkills && (
                  <div style={S.section}>
                    <h2 style={S.heading}>Soft Skills</h2>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start'}}>
                      {cv.softSkills.split(',').map((skill, i) => (
                        <span key={i} style={{padding: '2px 8px', background: '#ffedd5', color: '#9a3412', borderRadius: '4px', fontSize: '10px', display: 'inline-block'}}>{skill.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {cv.projects.some(p => p.name) && (
                  <div style={S.section}>
                    <h2 style={S.heading}>Projects</h2>
                    {cv.projects.filter(p => p.name).map((proj, i) => (
                      <div key={i} style={{marginBottom: '8px'}}>
                        <p style={S.bold11}>{proj.name}</p>
                        {proj.tech && <p style={S.orange11}>Tech: {proj.tech}</p>}
                        {proj.description && <p style={S.dark11}>{proj.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {cv.certifications?.some(c => c.name) && (
                  <div style={S.section}>
                    <h2 style={S.heading}>Courses & Certifications</h2>
                    {cv.certifications.filter(c => c.name).map((cert, i) => (
                      <div key={i} style={{...S.row, marginBottom: '6px'}}>
                        <div style={{flex: 1}}>
                          <p style={S.bold11}>{cert.name}</p>
                          <p style={S.dark11}>{cert.institution}</p>
                        </div>
                        <p style={{...S.orange11, marginLeft: '8px', whiteSpace: 'nowrap'}}>{cert.year}</p>
                      </div>
                    ))}
                  </div>
                )}

                {cv.references?.some(r => r.name) && (
                  <div style={S.section}>
                    <h2 style={S.heading}>References</h2>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                      {cv.references.filter(r => r.name).map((ref, i) => (
                        <div key={i} style={{background: '#f9fafb', borderRadius: '6px', padding: '8px'}}>
                          <p style={S.bold11}>{ref.name}</p>
                          <p style={S.orange11}>{ref.designation}</p>
                          <p style={S.dark11}>{ref.organization}</p>
                          <p style={{...S.gray11, margin: 0}}>{ref.contact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="text-4xl mb-3">{tip.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tip.desc}</p>
            </div>
          ))}
          <div className="md:col-span-2 lg:col-span-3 rounded-2xl p-6 text-white"
            style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #ea580c 100%)'}}>
            <h3 className="text-xl font-bold mb-2">🌟 Pro Tip for SLIIT Students</h3>
            <p className="text-blue-100">Use InternHub's CV Builder to create a professional PDF CV in minutes. Fill in your details, preview it live, and download it ready to send to employers!</p>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {templates.map((template, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <div className={`h-32 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                  <span className="text-white text-5xl">📄</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{template.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{template.desc}</p>
                  <button onClick={() => setActiveTab('builder')}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-blue-800 to-orange-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                    Use This Style →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-blue-700 font-medium">💡 Currently all templates use our InternHub Blue & Orange theme. More templates coming soon!</p>
          </div>
        </div>
      )}
    </div>
  );
}
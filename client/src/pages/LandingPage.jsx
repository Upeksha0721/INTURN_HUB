import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError('All fields are required!'); return;
    }
    setContactLoading(true); setContactError('');
    try {
      const res = await fetch('http://localhost:5001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
      } else { setContactError('Failed to send message. Try again!'); }
    } catch (err) { setContactError('Failed to send message. Try again!'); }
    finally { setContactLoading(false); }
  };

  const features = [
    {
      icon: '',
      title: 'Browse Internships',
      desc: 'Explore hundreds of internship opportunities from top companies across Sri Lanka.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
      color: 'from-blue-900 to-blue-700'
    },
    {
      icon: '',
      title: 'Study Materials',
      desc: 'Access curated study resources to prepare yourself for internship interviews.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
      color: 'from-blue-800 to-indigo-700'
    },
    {
      icon: '',
      title: 'Skill Assessments',
      desc: 'Take quizzes to assess your skills and stand out from other applicants.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
      color: 'from-yellow-700 to-yellow-500'
    },
    {
      icon: '',
      title: 'Track Applications',
      desc: 'Manage and track all your internship applications in one place.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
      color: 'from-yellow-600 to-amber-600'
    },
  ];

  const team = [
    { name: 'Akshari Upeksha', role: 'Auth & Admin Module', avatar: 'A' },
    { name: 'Member B', role: 'Vacancy Module', avatar: 'B' },
    { name: 'Kodni Diyana', role: 'Study Material Module', avatar: 'K' },
    { name: 'Member D', role: 'Quiz Module', avatar: 'D' },
  ];

  /* ─── shared inline style helpers ─── */
  const navyInput = {
    background: '#001233',
    border: '1px solid #0d3460',
    color: '#e2eaf4',
  };

  return (
    <div style={{ background: '#000d24' }} className="text-white min-h-screen">

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(0,13,36,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(250,204,21,0.12)' : 'none',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0d3460, #facc15)' }}
            >🎓</div>
            <div>
              <span className="text-xl font-bold text-white">InternHub</span>
              <div className="text-xs -mt-1" style={{ color: '#facc15' }}>Sri Lanka</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'About Us', href: '#about' },
              { label: 'Contact Us', href: '#contact' },
            ].map(link => (
              <a
                key={link.label} href={link.href}
                className="px-4 py-2 rounded-lg text-sm transition-all hover:bg-white/10"
                style={{ color: '#93b4d4' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#93b4d4'}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-lg text-sm transition-all"
              style={{ color: '#93b4d4', border: '1px solid #0d3460' }}
              onMouseEnter={e => { e.target.style.borderColor = '#facc15'; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.borderColor = '#0d3460'; e.target.style.color = '#93b4d4'; }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                color: '#001233',
                boxShadow: '0 4px 16px rgba(250,204,21,0.25)',
              }}
              onMouseEnter={e => e.target.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.target.style.filter = 'none'}
            >
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="min-h-screen flex items-center justify-center px-6 pt-20 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,18,51,0.93) 0%, rgba(0,13,36,0.85) 50%, rgba(10,20,10,0.80) 100%)' }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-8"
            style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.3)', color: '#facc15' }}
          >
            🚀 Your Gateway to Internship Success
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Start Your
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #60a5fa, #facc15)' }}
            > Internship </span>
            Journey
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#93b4d4' }}>
            InternHub connects students with top companies, providing internship listings, skill assessments, and study materials — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)', color: '#fff', boxShadow: '0 4px 20px rgba(30,58,138,0.4)' }}
            >
              Get Started Free 🚀
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                color: '#001233',
                boxShadow: '0 4px 20px rgba(250,204,21,0.28)',
              }}
              onMouseEnter={e => e.target.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.target.style.filter = 'none'}
            >
              Login to Account
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            {[
              { value: '50+', label: 'Companies', color: '#60a5fa' },
              { value: '200+', label: 'Students', color: '#facc15' },
              { value: '100+', label: 'Internships', color: '#93c5fd' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm mt-1" style={{ color: '#5a7fa8' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6" style={{ background: 'rgba(0,18,51,0.6)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-4"
              style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)', color: '#facc15' }}
            >
              ✨ Why Choose InternHub?
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5a7fa8' }}>
              Powerful features designed to help Sri Lankan students land their dream internship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl transition-all hover:-translate-y-1 cursor-pointer"
                style={{ border: '1px solid #0d3460' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#facc15'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#0d3460'}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={feature.image} alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-80`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl filter drop-shadow-lg">{feature.icon}</span>
                  </div>
                </div>
                <div className="p-6" style={{ background: '#001233' }}>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#5a7fa8' }}>{feature.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: '#facc15' }}>
                    <span>Learn more</span><span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-20 px-6" style={{ background: '#000d24' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6"
                style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)', color: '#facc15' }}
              >
                🎓 About Us
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">About InternHub</h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#5a7fa8' }}>
                InternHub is a full-stack Internship Management System built by a team of undergraduate Software Engineering students at SLIIT (Sri Lanka Institute of Information Technology).
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{ color: '#5a7fa8' }}>
                Our platform bridges the gap between students seeking valuable internship experience and companies looking for talented interns.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ background: '#001233', border: '1px solid #0d3460' }}>
                  <div className="text-2xl font-bold" style={{ color: '#60a5fa' }}>MERN</div>
                  <div className="text-sm" style={{ color: '#5a7fa8' }}>Stack</div>
                </div>
                <div className="rounded-xl p-4" style={{ background: '#001233', border: '1px solid rgba(250,204,21,0.25)' }}>
                  <div className="text-2xl font-bold" style={{ color: '#facc15' }}>Micro</div>
                  <div className="text-sm" style={{ color: '#5a7fa8' }}>Services</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Our Team</h3>
              <div className="grid grid-cols-2 gap-4">
                {team.map((member, i) => (
                  <div
                    key={member.name}
                    className="rounded-xl p-4 flex items-center gap-3 transition-all"
                    style={{ background: '#001233', border: '1px solid #0d3460' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#facc15'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#0d3460'}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{
                        background: i % 2 === 0
                          ? 'linear-gradient(135deg, #1e3a8a, #1d4ed8)'
                          : 'linear-gradient(135deg, #facc15, #f59e0b)',
                        color: i % 2 === 0 ? '#fff' : '#001233',
                      }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{member.name}</div>
                      <div className="text-xs" style={{ color: '#5a7fa8' }}>{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section
        id="contact" className="py-20 px-6 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80')`,
          backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat'
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,18,51,0.90), rgba(0,13,36,0.88))' }}
        ></div>
        <div className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm mb-6"
              style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)', color: '#facc15' }}
            >
              📬 Get In Touch
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-lg mb-10" style={{ color: '#93b4d4' }}>Have questions? We'd love to hear from you!</p>

            <div
              className="backdrop-blur-sm rounded-2xl p-8"
              style={{ background: 'rgba(0,18,51,0.85)', border: '1px solid rgba(250,204,21,0.15)' }}
            >
              {contactSuccess && (
                <div
                  className="px-4 py-3 rounded-lg mb-4 text-sm"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#86efac' }}
                >
                  ✅ Message sent! We'll get back to you soon.
                </div>
              )}
              {contactError && (
                <div
                  className="px-4 py-3 rounded-lg mb-4 text-sm"
                  style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', color: '#fca5a5' }}
                >
                  ❌ {contactError}
                </div>
              )}

              <div className="space-y-4">
                {[
                  { key: 'name', placeholder: 'Your Name', type: 'text' },
                  { key: 'email', placeholder: 'Your Email', type: 'email' },
                ].map(field => (
                  <input
                    key={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={contactForm[field.key]}
                    onChange={e => setContactForm({ ...contactForm, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm transition-all focus:outline-none"
                    style={navyInput}
                    onFocus={e => { e.target.style.borderColor = '#facc15'; e.target.style.boxShadow = '0 0 0 2px rgba(250,204,21,0.18)'; }}
                    onBlur={e => { e.target.style.borderColor = '#0d3460'; e.target.style.boxShadow = 'none'; }}
                  />
                ))}
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm resize-none transition-all focus:outline-none"
                  style={navyInput}
                  onFocus={e => { e.target.style.borderColor = '#facc15'; e.target.style.boxShadow = '0 0 0 2px rgba(250,204,21,0.18)'; }}
                  onBlur={e => { e.target.style.borderColor = '#0d3460'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  onClick={handleContactSubmit}
                  disabled={contactLoading}
                  className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #facc15, #f59e0b)',
                    color: '#001233',
                    boxShadow: '0 4px 20px rgba(250,204,21,0.25)',
                  }}
                  onMouseEnter={e => { if (!contactLoading) e.target.style.filter = 'brightness(1.1)'; }}
                  onMouseLeave={e => { e.target.style.filter = 'none'; }}
                >
                  {contactLoading ? '⏳ Sending...' : 'Send Message 📨'}
                </button>
              </div>

              <div
                className="mt-6 pt-6 grid grid-cols-3 gap-4 text-center"
                style={{ borderTop: '1px solid #0d3460' }}
              >
                {[
                  { icon: '📧', text: 'internhub@gmail.com' },
                  { icon: '📍', text: 'SLIIT, Sri Lanka' },
                  { icon: '📱', text: '+94 11 123 4567' },
                ].map(item => (
                  <div key={item.text}>
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs" style={{ color: '#5a7fa8' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#00091a', borderTop: '1px solid rgba(250,204,21,0.1)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'linear-gradient(135deg, #0d3460, #facc15)' }}
                >🎓</div>
                <span className="text-2xl font-bold text-white">InternHub</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: '#3b5f82' }}>
                Connecting Sri Lankan students with top companies. Your gateway to internship success — find opportunities, build skills, and launch your career.
              </p>
              <div className="flex gap-3">
                {[
                  { label: 'f', hoverBg: '#1d4ed8' },
                  { label: 'in', hoverBg: '#1e40af' },
                  { label: 'ig', hoverBg: '#f59e0b' },
                ].map(social => (
                  <a
                    key={social.label} href="#"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all text-xs font-bold"
                    style={{ background: '#001233', color: '#5a7fa8', border: '1px solid #0d3460' }}
                    onMouseEnter={e => { e.target.style.background = social.hoverBg; e.target.style.color = '#fff'; e.target.style.borderColor = social.hoverBg; }}
                    onMouseLeave={e => { e.target.style.background = '#001233'; e.target.style.color = '#5a7fa8'; e.target.style.borderColor = '#0d3460'; }}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'About Us', href: '#about' },
                  { label: 'Contact', href: '#contact' },
                ].map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: '#3b5f82' }}
                      onMouseEnter={e => e.target.style.color = '#facc15'}
                      onMouseLeave={e => e.target.style.color = '#3b5f82'}
                    >
                      ✦ {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate('/login')} className="text-sm transition-colors" style={{ color: '#3b5f82' }}
                    onMouseEnter={e => e.target.style.color = '#facc15'}
                    onMouseLeave={e => e.target.style.color = '#3b5f82'}>
                    ✦ Login
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/register')} className="text-sm transition-colors" style={{ color: '#3b5f82' }}
                    onMouseEnter={e => e.target.style.color = '#facc15'}
                    onMouseLeave={e => e.target.style.color = '#3b5f82'}>
                    ✦ Register
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
              <ul className="space-y-3">
                {[
                  { icon: '📧', text: 'internhub@gmail.com' },
                  { icon: '📍', text: 'SLIIT, Malabe,\nSri Lanka' },
                  { icon: '📱', text: '+94 11 123 4567' },
                ].map(item => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span style={{ color: '#facc15' }} className="mt-0.5">{item.icon}</span>
                    <span className="text-sm whitespace-pre-line" style={{ color: '#3b5f82' }}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #0d1f3c' }} className="px-6 py-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm" style={{ color: '#2a4a6b' }}>© 2026 InternHub. All rights reserved.</p>
            <p className="text-sm" style={{ color: '#1e3a5f' }}>Built with ❤️ by SLIIT Software Engineering Students</p>
            <div className="flex gap-4">
              {['Privacy Policy', 'Terms of Service'].map(label => (
                <a
                  key={label} href="#"
                  className="text-xs transition-colors"
                  style={{ color: '#2a4a6b' }}
                  onMouseEnter={e => e.target.style.color = '#facc15'}
                  onMouseLeave={e => e.target.style.color = '#2a4a6b'}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
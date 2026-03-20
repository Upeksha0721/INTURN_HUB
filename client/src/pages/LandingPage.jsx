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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

const handleContactSubmit = async () => {
  if (!contactForm.name || !contactForm.email || !contactForm.message) {
    setContactError('All fields are required!');
    return;
  }
  setContactLoading(true);
  setContactError('');
  try {
    const res = await fetch('http://localhost:5001/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm)
    });
    if (res.ok) {
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
    } else {
      setContactError('Failed to send message. Try again!');
    }
  } catch (err) {
    setContactError('Failed to send message. Try again!');
  } finally {
    setContactLoading(false);
  }
};

  const features = [
    {
      icon: '',
      title: 'Browse Internships',
      desc: 'Explore hundreds of internship opportunities from top companies across Sri Lanka.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: '',
      title: 'Study Materials',
      desc: 'Access curated study resources to prepare yourself for internship interviews.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: '',
      title: 'Skill Assessments',
      desc: 'Take quizzes to assess your skills and stand out from other applicants.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
      color: 'from-green-600 to-teal-600'
    },
    {
      icon: '',
      title: 'Track Applications',
      desc: 'Manage and track all your internship applications in one place.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
      color: 'from-orange-600 to-red-600'
    },
  ];

  const team = [
    { name: 'Akshari Upeksha', role: 'Auth & Admin Module', avatar: 'A' },
    { name: 'Member B', role: 'Vacancy Module', avatar: 'B' },
    { name: 'Kodni Diyana', role: 'Study Material Module', avatar: 'K' },
    { name: 'Member D', role: 'Quiz Module', avatar: 'D' },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/98 backdrop-blur-md shadow-lg shadow-black/20 border-b border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">🎓</div>
            <div>
              <span className="text-xl font-bold text-white">InternHub</span>
              <div className="text-indigo-400 text-xs -mt-1">Sri Lanka</div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'About Us', href: '#about' },
              { label: 'Contact Us', href: '#contact' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg text-sm transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center px-6 pt-20 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gray-900/75"></div>
        {/* Content must be above overlay */}
        <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 bg-indigo-900/50 border border-indigo-700 rounded-full px-4 py-2 text-indigo-300 text-sm mb-8">
            🚀 Your Gateway to Internship Success
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Start Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> Internship </span>
            Journey
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            InternHub connects students with top companies, providing internship listings, skill assessments, and study materials — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
            >
              Get Started Free 🚀
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold text-lg transition-all border border-gray-700"
            >
              Login to Account
            </button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">50+</div>
              <div className="text-gray-500 text-sm mt-1">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">200+</div>
              <div className="text-gray-500 text-sm mt-1">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">100+</div>
              <div className="text-gray-500 text-sm mt-1">Internships</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
    <section id="features" className="py-20 px-6 bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-900/50 border border-indigo-700 rounded-full px-4 py-2 text-indigo-300 text-sm mb-4">
        ✨ Why Choose InternHub?
        </div>
       <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
       <p className="text-gray-400 text-lg max-w-2xl mx-auto">Powerful features designed to help Sri Lankan students land their dream internship</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="group relative overflow-hidden rounded-2xl border border-gray-700 hover:border-indigo-500 transition-all hover:-translate-y-1 cursor-pointer"
        >
          {/* Background Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-70`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl filter drop-shadow-lg">{feature.icon}</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-800 p-6">
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            <div className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-medium group-hover:gap-3 transition-all">
              <span>Learn more</span>
              <span>→</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">About InternHub</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                InternHub is a full-stack Internship Management System built by a team of undergraduate Software Engineering students at SLIIT (Sri Lanka Institute of Information Technology).
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Our platform bridges the gap between students seeking valuable internship experience and companies looking for talented interns. We provide a seamless experience for both students and administrators.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-indigo-400">MERN</div>
                  <div className="text-gray-400 text-sm">Stack</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="text-2xl font-bold text-purple-400">Micro</div>
                  <div className="text-gray-400 text-sm">Services</div>
                </div>
              </div>
            </div>
            {/* Team */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Our Team</h3>
              <div className="grid grid-cols-2 gap-4">
                {team.map((member) => (
                  <div key={member.name} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{member.name}</div>
                      <div className="text-gray-400 text-xs">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
<section
  id="contact"
  className="py-20 px-6 relative"
  style={{
    backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="absolute inset-0 bg-gray-900/80"></div>
  <div className="relative z-10">
  <div className="max-w-2xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
    <p className="text-gray-400 text-lg mb-10">Have questions? We'd love to hear from you!</p>
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
      {contactSuccess && (
        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">
          ✅ Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {contactError && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
          ❌ {contactError}
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={contactForm.name}
          onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={contactForm.email}
          onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
        />
        <textarea
          rows={4}
          placeholder="Your Message"
          value={contactForm.message}
          onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm resize-none"
        />
        <button
          onClick={handleContactSubmit}
          disabled={contactLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {contactLoading ? 'Sending...' : 'Send Message 📨'}
        </button>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl mb-1">📧</div>
          <div className="text-gray-400 text-xs">internhub@gmail.com</div>
        </div>
        <div>
          <div className="text-2xl mb-1">📍</div>
          <div className="text-gray-400 text-xs">SLIIT, Sri Lanka</div>
        </div>
        <div>
          <div className="text-2xl mb-1">📱</div>
          <div className="text-gray-400 text-xs">+94 11 123 4567</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800">
        {/* Main Footer */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎓</span>
                <span className="text-2xl font-bold text-white">InternHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Connecting Sri Lankan students with top companies. Your gateway to internship success — find opportunities, build skills, and launch your career.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all text-gray-400 hover:text-white text-lg">f</a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all text-gray-400 hover:text-white text-lg">in</a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all text-gray-400 hover:text-white text-lg">ig</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">✦ Features</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">✦ About Us</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">✦ Contact</a></li>
                <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">✦ Login</button></li>
                <li><button onClick={() => navigate('/register')} className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">✦ Register</button></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-0.5">📧</span>
                  <span className="text-gray-400 text-sm">internhub@gmail.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-0.5">📍</span>
                  <span className="text-gray-400 text-sm">SLIIT, Malabe,<br/>Sri Lanka</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-400 mt-0.5">📱</span>
                  <span className="text-gray-400 text-sm">+94 11 123 4567</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 px-6 py-5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">© 2026 InternHub. All rights reserved.</p>
            <p className="text-gray-600 text-sm">
              Built with ❤️ by SLIIT Software Engineering Students
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
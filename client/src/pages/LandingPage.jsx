import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: '💼', title: 'Browse Internships', desc: 'Explore hundreds of internship opportunities from top companies across Sri Lanka.' },
    { icon: '📚', title: 'Study Materials', desc: 'Access curated study resources to prepare yourself for internship interviews.' },
    { icon: '🧠', title: 'Skill Assessments', desc: 'Take quizzes to assess your skills and stand out from other applicants.' },
    { icon: '📋', title: 'Track Applications', desc: 'Manage and track all your internship applications in one place.' },
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
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-white">InternHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
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
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Powerful features to help you land your dream internship</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition-all hover:transform hover:-translate-y-1">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
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
      <section id="contact" className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 text-lg mb-10">Have questions? We'd love to hear from you!</p>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm"
              />
              <textarea
                rows={4}
                placeholder="Your Message"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 text-sm resize-none"
              />
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all">
                Send Message 📨
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
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <span className="text-lg font-bold text-white">InternHub</span>
            </div>
            <div className="flex gap-6">
              <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a>
              <a href="#about" className="text-gray-400 hover:text-white text-sm transition-colors">About</a>
              <a href="#contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
              <button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white text-sm transition-colors">Login</button>
              <button onClick={() => navigate('/register')} className="text-gray-400 hover:text-white text-sm transition-colors">Register</button>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 InternHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
import { useState, useEffect } from 'react';

const QUIZ_API = 'http://localhost:5004/api/quizzes';

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quizzes');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  const emptyQuiz = {
    title: '', description: '', category: 'General', timeLimit: 30,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  };
  const [form, setForm] = useState(emptyQuiz);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [quizRes, resultRes] = await Promise.all([
        fetch(QUIZ_API, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${QUIZ_API}/results/all`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const quizData = await quizRes.json();
      const resultData = await resultRes.json();
      setQuizzes(Array.isArray(quizData) ? quizData : []);
      setResults(Array.isArray(resultData) ? resultData : []);
    } catch (err) { console.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  const addQuestion = () => setForm(prev => ({
    ...prev,
    questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
  }));

  const removeQuestion = (i) => setForm(prev => ({
    ...prev,
    questions: prev.questions.filter((_, idx) => idx !== i)
  }));

  const updateQuestion = (qi, field, value) => {
    const updated = [...form.questions];
    updated[qi][field] = value;
    setForm(prev => ({ ...prev, questions: updated }));
  };

  const updateOption = (qi, oi, value) => {
    const updated = [...form.questions];
    updated[qi].options[oi] = value;
    setForm(prev => ({ ...prev, questions: updated }));
  };

  const handleSave = async () => {
    if (!form.title || form.questions.some(q => !q.question || q.options.some(o => !o))) {
      alert('Please fill in all fields!'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(QUIZ_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess('Quiz created successfully!');
        setForm(emptyQuiz);
        setShowForm(false);
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) { console.error('Failed to save quiz'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await fetch(`${QUIZ_API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { console.error('Failed to delete'); }
  };

  const getGrade = (pct) => {
    if (pct >= 90) return { label: 'A+', color: 'text-green-600' };
    if (pct >= 80) return { label: 'A', color: 'text-green-500' };
    if (pct >= 70) return { label: 'B', color: 'text-blue-600' };
    if (pct >= 60) return { label: 'C', color: 'text-yellow-600' };
    return { label: 'F', color: 'text-red-600' };
  };

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center"><div className="text-4xl mb-4">🧠</div><p className="text-gray-500">Loading...</p></div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🧠 Manage Quizzes</h1>
          <p className="text-gray-500 mt-1">Create and manage quizzes for students</p>
        </div>
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm">✅ {success}</div>}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {[{ id: 'quizzes', label: '📝 Quizzes' }, { id: 'results', label: '📊 Student Results' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-800 to-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div>
          {/* Create Quiz Button */}
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-800 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
              ➕ Create New Quiz
            </button>
          )}

          {/* Create Quiz Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">➕ Create New Quiz</h2>
                <button onClick={() => { setShowForm(false); setForm(emptyQuiz); }}
                  className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                    <input type="text" placeholder="e.g. JavaScript Basics" value={form.title}
                      onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                      {['General', 'Programming', 'Web Development', 'Database', 'Networking', 'Software Engineering'].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input type="text" placeholder="Brief description..." value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                    <input type="number" min="5" max="120" value={form.timeLimit}
                      onChange={e => setForm(p => ({ ...p, timeLimit: parseInt(e.target.value) }))} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <h3 className="font-bold text-gray-700 mb-4">Questions</h3>
              <div className="space-y-5">
                {form.questions.map((q, qi) => (
                  <div key={qi} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-800 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                        {qi + 1}
                      </span>
                      {form.questions.length > 1 && (
                        <button onClick={() => removeQuestion(qi)}
                          className="text-red-400 hover:text-red-600 text-sm font-medium">
                          🗑️ Remove
                        </button>
                      )}
                    </div>

                    <input type="text" placeholder="Enter your question..." value={q.question}
                      onChange={e => updateQuestion(qi, 'question', e.target.value)}
                      className={`${inputCls} mb-3`} />

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input
                            type="radio" name={`correct-${qi}`}
                            checked={q.correctAnswer === oi}
                            onChange={() => updateQuestion(qi, 'correctAnswer', oi)}
                            className="shrink-0 accent-blue-800"
                          />
                          <input type="text" placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                            className={`${inputCls} ${q.correctAnswer === oi ? 'border-green-400 bg-green-50' : ''}`} />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">🟢 Select the radio button next to the correct answer</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={addQuestion}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-all">
                  ➕ Add Question
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-800 to-orange-600 text-white rounded-xl font-bold transition-all disabled:opacity-50">
                  {saving ? '⏳ Saving...' : '💾 Save Quiz'}
                </button>
              </div>
            </div>
          )}

          {/* Quizzes List */}
          {quizzes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Quizzes Yet</h3>
              <p className="text-gray-500">Create your first quiz above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {quizzes.map(quiz => (
                <div key={quiz._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  <div className="h-3 bg-gradient-to-r from-blue-800 to-orange-600"></div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                        {quiz.category || 'General'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {results.filter(r => r.quizId?._id === quiz._id).length} attempts
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{quiz.title}</h3>
                    {quiz.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{quiz.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span>❓ {quiz.questions?.length || 0} questions</span>
                      <span>⏱ {quiz.timeLimit || 30} mins</span>
                      <span>📅 {new Date(quiz.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => handleDelete(quiz._id)}
                      className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all">
                      🗑️ Delete Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
              <div className="text-3xl font-bold text-blue-800">{results.length}</div>
              <div className="text-gray-500 text-sm mt-1">Total Attempts</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
              <div className="text-3xl font-bold text-green-600">
                {results.filter(r => r.percentage >= 60).length}
              </div>
              <div className="text-gray-500 text-sm mt-1">Passed</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {results.length > 0 ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0}%
              </div>
              <div className="text-gray-500 text-sm mt-1">Average Score</div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-gray-500">No student results yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Quiz</th>
                    <th className="text-center py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Score</th>
                    <th className="text-center py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                    <th className="text-center py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.map((result, i) => {
                    const grade = getGrade(result.percentage);
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-all">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-800 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                              {result.studentName?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <p className="font-semibold text-gray-800 text-sm">{result.studentName || 'Unknown'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <p className="text-gray-700 text-sm font-medium">{result.quizId?.title || 'Unknown'}</p>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className="font-bold text-gray-800">{result.score}/{result.total}</span>
                          <p className="text-gray-400 text-xs">{result.percentage}%</p>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className={`text-xl font-bold ${grade.color}`}>{grade.label}</span>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.percentage >= 60 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {result.percentage >= 60 ? '✅ Passed' : '❌ Failed'}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-gray-500 text-sm">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </td>
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
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const QUIZ_API = 'http://localhost:5004/api/quizzes';

export default function Quizzes() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!activeQuiz || timeLeft === null) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, activeQuiz]);

  const fetchData = async () => {
    try {
      const [quizRes, resultRes] = await Promise.all([
        fetch(QUIZ_API, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${QUIZ_API}/results/me`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const quizData = await quizRes.json();
      const resultData = await resultRes.json();
      setQuizzes(Array.isArray(quizData) ? quizData : []);
      setResults(Array.isArray(resultData) ? resultData : []);
    } catch (err) { console.error('Failed to fetch quizzes'); }
    finally { setLoading(false); }
  };

  const startQuiz = async (quiz) => {
    try {
      const res = await fetch(`${QUIZ_API}/${quiz._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setActiveQuiz(data);
      setAnswers({});
      setQuizResult(null);
      setTimeLeft((data.timeLimit || 30) * 60);
    } catch (err) { console.error('Failed to load quiz'); }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const answerArray = activeQuiz.questions.map((_, i) => answers[i] ?? -1);
      const res = await fetch(`${QUIZ_API}/${activeQuiz._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers: answerArray })
      });
      const data = await res.json();
      setQuizResult(data);
      setActiveQuiz(null);
      setTimeLeft(null);
      fetchData();
    } catch (err) { console.error('Failed to submit quiz'); }
    finally { setSubmitting(false); }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getGrade = (pct) => {
    if (pct >= 90) return { label: 'A+', color: 'text-green-600' };
    if (pct >= 80) return { label: 'A', color: 'text-green-500' };
    if (pct >= 70) return { label: 'B', color: 'text-blue-600' };
    if (pct >= 60) return { label: 'C', color: 'text-yellow-600' };
    return { label: 'F', color: 'text-red-600' };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center"><div className="text-4xl mb-4">🧠</div><p className="text-gray-500">Loading quizzes...</p></div>
    </div>
  );

  // Quiz Result Screen
  if (quizResult) return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-6xl mb-4">{quizResult.percentage >= 60 ? '🎉' : '😔'}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h1>
        <p className="text-gray-500 mb-6">Here are your results</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-2xl p-4">
            <div className="text-3xl font-bold text-blue-800">{quizResult.score}</div>
            <div className="text-blue-600 text-sm mt-1">Correct</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-3xl font-bold text-gray-800">{quizResult.total}</div>
            <div className="text-gray-500 text-sm mt-1">Total</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4">
            <div className={`text-3xl font-bold ${getGrade(quizResult.percentage).color}`}>
              {getGrade(quizResult.percentage).label}
            </div>
            <div className="text-orange-600 text-sm mt-1">Grade</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Score</span>
            <span>{quizResult.percentage}%</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${quizResult.percentage}%`,
                background: 'linear-gradient(135deg, #1e3a8a, #ea580c)'
              }}
            ></div>
          </div>
        </div>

        <p className="text-gray-500 mb-6">
          {quizResult.percentage >= 80 ? '🌟 Excellent work! Keep it up!' :
           quizResult.percentage >= 60 ? '👍 Good job! Practice more to improve!' :
           '💪 Keep practicing! You can do better!'}
        </p>

        <div className="flex gap-3">
          <button onClick={() => { setQuizResult(null); setActiveTab('results'); }}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all">
            View Results
          </button>
          <button onClick={() => setQuizResult(null)}
            className="flex-1 py-3 bg-gradient-to-r from-blue-800 to-orange-600 text-white rounded-xl font-bold transition-all">
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );

  // Active Quiz Screen
  if (activeQuiz) return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{activeQuiz.title}</h1>
          <p className="text-gray-500 text-sm">{Object.keys(answers).length} of {activeQuiz.questions.length} answered</p>
        </div>
        <div className={`text-2xl font-bold px-4 py-2 rounded-xl ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-800'}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full rounded-full transition-all"
          style={{ width: `${(Object.keys(answers).length / activeQuiz.questions.length) * 100}%`, background: 'linear-gradient(135deg, #1e3a8a, #ea580c)' }}>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {activeQuiz.questions.map((q, qi) => (
          <div key={qi} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-800 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {qi + 1}
              </span>
              <p className="font-semibold text-gray-800 text-base">{q.question}</p>
            </div>
            <div className="space-y-2 ml-11">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [qi]: oi }))}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    answers[qi] === oi
                      ? 'border-blue-800 bg-blue-50 text-blue-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-6 flex gap-3">
        <button onClick={() => { setActiveQuiz(null); setTimeLeft(null); }}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all">
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={submitting}
          className="flex-1 py-3 bg-gradient-to-r from-blue-800 to-orange-600 hover:from-blue-900 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50">
          {submitting ? '⏳ Submitting...' : `Submit Quiz (${Object.keys(answers).length}/${activeQuiz.questions.length} answered)`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🧠 Quizzes</h1>
        <p className="text-gray-500 mt-1">Test your knowledge and track your progress</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {[{ id: 'available', label: '📝 Available Quizzes' }, { id: 'results', label: '📊 My Results' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-blue-800 to-orange-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Available Quizzes */}
      {activeTab === 'available' && (
        <div>
          {quizzes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Quizzes Available</h3>
              <p className="text-gray-500">Check back later for new quizzes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {quizzes.map(quiz => {
                const myResult = results.find(r => r.quizId?._id === quiz._id);
                return (
                  <div key={quiz._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="h-3 bg-gradient-to-r from-blue-800 to-orange-600"></div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                          {quiz.category || 'General'}
                        </span>
                        {myResult && (
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${myResult.percentage >= 60 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {myResult.percentage}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{quiz.title}</h3>
                      {quiz.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2">{quiz.description}</p>}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span>❓ {quiz.questions?.length || 0} questions</span>
                        <span>⏱ {quiz.timeLimit || 30} mins</span>
                      </div>
                      <button onClick={() => startQuiz(quiz)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-800 to-orange-600 hover:from-blue-900 hover:to-orange-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
                        {myResult ? '🔄 Retake Quiz' : '▶ Start Quiz'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Results */}
      {activeTab === 'results' && (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">No Results Yet</h3>
              <p className="text-gray-500">Take a quiz to see your results here!</p>
              <button onClick={() => setActiveTab('available')}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-800 to-orange-600 text-white rounded-xl text-sm font-bold">
                Browse Quizzes →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
                  <div className="text-3xl font-bold text-blue-800">{results.length}</div>
                  <div className="text-gray-500 text-sm mt-1">Quizzes Taken</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)}%
                  </div>
                  <div className="text-gray-500 text-sm mt-1">Average Score</div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {results.filter(r => r.percentage >= 60).length}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">Passed</div>
                </div>
              </div>

              {/* Results List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
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
                            <p className="font-semibold text-gray-800">{result.quizId?.title || 'Unknown Quiz'}</p>
                            <p className="text-gray-400 text-xs">{result.quizId?.category || 'General'}</p>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
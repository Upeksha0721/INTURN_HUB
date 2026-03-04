import { useState } from 'react';

export default function CreateQuiz() {
  const [quiz, setQuiz] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: '' }
  ]);
  const [success, setSuccess] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Quiz created successfully! (Connect to quiz service when Member D is done)');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🧠 Create Quiz</h1>
        <p className="text-gray-500 mt-1">Create quizzes for students to test their knowledge.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Quiz Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-700">Quiz Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
            <input
              type="text"
              placeholder="e.g. JavaScript Basics Quiz"
              value={quiz.title}
              onChange={e => setQuiz({ ...quiz, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="What is this quiz about?"
              value={quiz.description}
              onChange={e => setQuiz({ ...quiz, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-700">Question {qIndex + 1}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                placeholder="Enter your question"
                value={q.question}
                onChange={e => updateQuestion(qIndex, 'question', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Option {oIndex + 1}</label>
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
              <select
                value={q.answer}
                onChange={e => updateQuestion(qIndex, 'answer', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Select correct answer</option>
                {q.options.map((opt, oIndex) => (
                  <option key={oIndex} value={opt}>{opt || `Option ${oIndex + 1}`}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 rounded-xl font-medium transition-all"
        >
          + Add Another Question
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}
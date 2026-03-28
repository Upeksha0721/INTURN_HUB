const Quiz = require('../models/Quiz');
const Result = require('../models/QuizResult');

// GET all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-questions.correctAnswer').sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET single quiz
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST create quiz (admin only)
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, category, questions, timeLimit } = req.body;
    if (!title || !questions?.length)
      return res.status(400).json({ message: 'Title and questions are required' });
    const quiz = await Quiz.create({ title, description, category, questions, timeLimit, createdBy: req.user.id });
    res.status(201).json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE quiz (admin only)
exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const { answers } = req.body;
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const result = await Result.create({
      studentId: req.user.id,
      studentName: req.user.name,
      quizId: quiz._id,
      answers,
      score,
      total: quiz.questions.length,
      percentage
    });

    res.json({ message: 'Quiz submitted!', score, total: quiz.questions.length, percentage, result });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET my results
exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id }).populate('quizId', 'title category').sort({ createdAt: -1 });
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET all results (admin)
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate('quizId', 'title').sort({ createdAt: -1 });
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
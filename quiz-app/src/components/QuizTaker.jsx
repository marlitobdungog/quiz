import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const QuizTaker = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [userName, setUserName] = useState('');
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${API_BASE}/quizzes/${id}`);
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        setError('Quiz not found or error loading quiz');
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Please answer all questions');
      return;
    }

    const answersArray = quiz.questions.map((_, index) => answers[index]);
    try {
      const response = await axios.post(`${API_BASE}/quizzes/${id}/submit`, {
        userName,
        answers: answersArray
      });
      setResult(response.data);
    } catch (err) {
      alert('Error submitting quiz');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  if (result) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto border-t-8 border-green-500 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
        <p className="text-xl text-gray-600 mb-6">Thank you, {userName}!</p>
        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-gray-500 uppercase tracking-wider text-sm font-bold mb-1">Your Score</p>
          <p className="text-5xl font-black text-gray-800">
            {result.score} <span className="text-2xl text-gray-400">/ {result.total}</span>
          </p>
        </div>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto border-t-8 border-blue-500">
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-600 mb-6">{quiz.description}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <button
            onClick={() => userName && setStarted(true)}
            disabled={!userName}
            className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-8 border-blue-500">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-600">{quiz.description}</p>
        <p className="mt-4 text-sm text-gray-500 font-medium border-t pt-4">Taking as: <span className="text-gray-800">{userName}</span></p>
      </div>

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium mb-4">{qIndex + 1}. {q.text}</p>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => (
              <label key={oIndex} className="flex items-center p-3 rounded border hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  className="w-4 h-4 text-blue-600"
                  onChange={() => setAnswers({ ...answers, [qIndex]: oIndex })}
                  checked={answers[qIndex] === oIndex}
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end pb-10">
        <button
          type="submit"
          className="px-10 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          Submit Answers
        </button>
      </div>
    </form>
  );
};

export default QuizTaker;

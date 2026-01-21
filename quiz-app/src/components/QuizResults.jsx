import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { User, Trophy, Calendar } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const QuizResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, resultsRes] = await Promise.all([
          axios.get(`${API_BASE}/admin/quizzes/${id}`),
          axios.get(`${API_BASE}/quizzes/${id}/results`)
        ]);
        setQuiz(quizRes.data);
        setResults(resultsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading results...</div>;
  if (!quiz) return <div className="text-center mt-10 text-red-500">Quiz not found</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-8 border-purple-600">
        <h1 className="text-3xl font-bold mb-2">Results: {quiz.title}</h1>
        <p className="text-gray-600">Total responses: {results.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Participant</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Score</th>
              <th className="p-4 font-semibold text-gray-600">Date Completed</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500 italic">No responses yet</td>
              </tr>
            ) : (
              results.map((result) => (
                <tr key={result.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-800">{result.user_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full font-bold border border-green-100">
                      <Trophy className="w-3 h-3" />
                      {result.score} / {result.total}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(result.completed_at).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Questions Overview</h2>
          <div className="space-y-4">
              {quiz.questions.map((q, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border">
                      <p className="font-medium mb-2">{idx + 1}. {q.text}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className={`p-2 rounded text-sm ${oIdx === q.correctAnswer ? 'bg-green-50 border border-green-200 text-green-800 font-bold' : 'bg-gray-50 text-gray-600'}`}>
                                  {opt} {oIdx === q.correctAnswer && ' (Correct)'}
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default QuizResults;

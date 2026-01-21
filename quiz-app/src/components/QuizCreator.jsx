import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle2, Copy, ExternalLink } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const QuizCreator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', ''], correctAnswer: 0 }
  ]);
  const [quizId, setQuizId] = useState(null);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index, text) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const updateOptionText = (qIndex, oIndex, text) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = text;
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length > 2) {
        newQuestions[qIndex].options.splice(oIndex, 1);
        if (newQuestions[qIndex].correctAnswer >= newQuestions[qIndex].options.length) {
            newQuestions[qIndex].correctAnswer = 0;
        }
        setQuestions(newQuestions);
    }
  };

  const setCorrectAnswer = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE}/quizzes`, {
        title,
        description,
        questions
      });
      setQuizId(response.data.id);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    }
  };

  if (quizId) {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;
    const resultsLink = `${window.location.origin}/quiz/${quizId}/results`;

    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto border-t-8 border-purple-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz Created Successfully!</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Share this link with participants:</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded">
              <input readOnly value={quizLink} className="bg-transparent flex-1 outline-none text-blue-600" />
              <button onClick={() => navigator.clipboard.writeText(quizLink)} className="p-2 hover:bg-gray-200 rounded">
                <Copy className="w-4 h-4" />
              </button>
              <a href={quizLink} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-200 rounded">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">View results here:</p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded">
              <input readOnly value={resultsLink} className="bg-transparent flex-1 outline-none text-purple-600" />
              <button onClick={() => navigator.clipboard.writeText(resultsLink)} className="p-2 hover:bg-gray-200 rounded">
                <Copy className="w-4 h-4" />
              </button>
              <a href={resultsLink} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-200 rounded">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <button
            onClick={() => {setQuizId(null); setTitle(''); setDescription(''); setQuestions([{ text: '', options: ['', ''], correctAnswer: 0 }]);}}
            className="mt-4 text-blue-600 hover:underline"
          >
            Create another quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-8 border-purple-600">
        <input
          type="text"
          placeholder="Quiz Title"
          className="text-3xl font-bold w-full border-b focus:border-purple-600 outline-none pb-2 mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Quiz Description"
          className="w-full border-b focus:border-purple-600 outline-none pb-2 h-12"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="bg-white p-6 rounded-lg shadow-md relative group border-l-4 border-transparent hover:border-blue-400">
          <div className="flex justify-between items-start mb-4">
            <input
              type="text"
              placeholder="Question"
              className="text-lg font-medium w-full bg-gray-50 p-3 rounded border-b focus:border-blue-500 outline-none"
              value={q.text}
              onChange={(e) => updateQuestionText(qIndex, e.target.value)}
            />
            <button
              onClick={() => removeQuestion(qIndex)}
              className="ml-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center gap-3">
                <button
                  onClick={() => setCorrectAnswer(qIndex, oIndex)}
                  className={`p-1 rounded-full border-2 ${
                    q.correctAnswer === oIndex ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  className="flex-1 border-b focus:border-blue-500 outline-none py-1"
                  value={option}
                  onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                />
                {q.options.length > 2 && (
                  <button
                    onClick={() => removeOption(qIndex, oIndex)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => addOption(qIndex)}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Option
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center py-4">
        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 font-medium"
        >
          <Plus className="w-5 h-5 text-blue-600" /> Add Question
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title || questions.some(q => !q.text)}
          className="px-8 py-2 bg-purple-600 text-white rounded font-bold shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCreator;

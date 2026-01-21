import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizCreator from './components/QuizCreator';
import QuizTaker from './components/QuizTaker';
import QuizResults from './components/QuizResults';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<QuizCreator />} />
            <Route path="/quiz/:id" element={<QuizTaker />} />
            <Route path="/quiz/:id/results" element={<QuizResults />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, List } from 'lucide-react';

const Home = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Online Quiz Maker</h1>
      <div className="flex justify-center gap-6">
        <Link
          to="/create"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-blue-500 w-48"
        >
          <PlusCircle className="w-12 h-12 text-blue-500 mb-2" />
          <span className="text-lg font-medium">Create Quiz</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;

# Online Quiz Maker

A Google Forms-like quiz application built with React, Vite, Tailwind CSS v4, and Node.js with SQLite.

## Features

- **Create Quizzes**: Admin can create quizzes with titles, descriptions, and multiple-choice questions.
- **Identify Correct Answers**: Mark correct options during quiz creation.
- **Shareable Links**: Generate unique links for participants to take the quiz.
- **Real-time Results**: Participants see their scores immediately after submission.
- **Admin Dashboard**: View all participant responses and scores for a specific quiz.

## Prerequisites

- Node.js (v18 or higher)
- npm

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

You can install all dependencies (root, frontend, and backend) with a single command from the root:

```bash
npm run install-all
```

### 3. Run the application

From the **root directory**, run:

```bash
npm run dev
```

This will start both the backend server (on port 5000) and the frontend development server (on port 5173).

- Access the app at: `http://localhost:5173`
- Create a quiz, then use the generated links to take it or view results.

## Project Structure

- `quiz-app/`: React + Vite frontend.
- `server/`: Express + SQLite backend.
- `package.json`: Root configuration to run both client and server concurrently.

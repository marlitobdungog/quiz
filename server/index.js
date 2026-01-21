const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./quiz.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the quiz database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    quiz_id TEXT,
    user_name TEXT,
    score INTEGER,
    total INTEGER,
    answers TEXT,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
  )`);
});

// Create a quiz
app.post('/api/quizzes', (req, res) => {
  const { title, description, questions } = req.body;
  const id = uuidv4();
  const content = JSON.stringify(questions);

  db.run(`INSERT INTO quizzes (id, title, description, content) VALUES (?, ?, ?, ?)`,
    [id, title, description, content],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id });
    }
  );
});

// Get quiz for taking (mask correct answers)
app.get('/api/quizzes/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM quizzes WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = {
      id: row.id,
      title: row.title,
      description: row.description,
      questions: JSON.parse(row.content).map(q => {
        const { correctAnswer, ...rest } = q;
        return rest;
      })
    };
    res.json(quiz);
  });
});

// Get quiz for admin (with correct answers)
app.get('/api/admin/quizzes/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM quizzes WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const quiz = {
        id: row.id,
        title: row.title,
        description: row.description,
        questions: JSON.parse(row.content)
      };
      res.json(quiz);
    });
  });

// Submit quiz results
app.post('/api/quizzes/:id/submit', (req, res) => {
  const quizId = req.params.id;
  const { userName, answers } = req.body;

  db.get(`SELECT content FROM quizzes WHERE id = ?`, [quizId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questions = JSON.parse(row.content);
    let score = 0;
    const total = questions.length;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    const resultId = uuidv4();
    db.run(`INSERT INTO results (id, quiz_id, user_name, score, total, answers) VALUES (?, ?, ?, ?, ?, ?)`,
      [resultId, quizId, userName, score, total, JSON.stringify(answers)],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ resultId, score, total });
      }
    );
  });
});

// Get results for a quiz (Admin)
app.get('/api/quizzes/:id/results', (req, res) => {
  const quizId = req.params.id;
  db.all(`SELECT * FROM results WHERE quiz_id = ? ORDER BY completed_at DESC`, [quizId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map(row => ({
        ...row,
        answers: JSON.parse(row.answers)
    })));
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

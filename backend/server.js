const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jackattack15', // must match what you set in MySQL
  database: 'toast_pos'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Get menu items
app.get('/api/menu', (req, res) => {
  db.query('SELECT * FROM menu_items', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error retrieving menu items.');
      return;
    }
    console.log("Query results:", results);
    res.json(results);
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'jackattack15',
  database: 'toast_pos'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');
});

// -------------------------
// GET /api/menu
// -------------------------
app.get('/api/menu', (req, res) => {
  db.query('SELECT * FROM menu_items', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Error retrieving menu items' });
    }
    console.log("Menu items fetched:", results.length);
    res.json(results);
  });
});

// -------------------------
// POST /api/orders
// -------------------------
app.post('/api/orders', (req, res) => {
  const { items, subtotal, taxAmount, grandTotal, paymentMethod } = req.body;

  if (!items || !subtotal || !taxAmount || !grandTotal || !paymentMethod) {
    console.log("Missing fields:", req.body);
    return res.status(400).json({ error: "Missing required order fields" });
  }

  console.log("Received order:", req.body);

  const query = `
    INSERT INTO orders (items, subtotal, taxAmount, grandTotal, paymentMethod, timestamp)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.execute(
    query,
    [JSON.stringify(items), subtotal, taxAmount, grandTotal, paymentMethod],
    (err, results) => {
      if (err) {
        console.error("Error inserting order:", err);
        return res.status(500).json({ error: "Database error" });
      }

      console.log("Order inserted with ID:", results.insertId);
      res.json({ success: true, id: results.insertId });
    }
  );
});

// -------------------------
// GET /api/orders
// -------------------------
app.get('/api/orders', (req, res) => {
  const query = `SELECT * FROM orders ORDER BY timestamp DESC LIMIT 100`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const formattedResults = results.map(order => {
      let itemsParsed = [];

      try {
        // Some MySQL clients return Buffer, so convert if needed
        const rawItems = order.items instanceof Buffer
          ? order.items.toString()
          : order.items;

        itemsParsed = JSON.parse(rawItems);
      } catch (e) {
        console.error("JSON parse error for order:", order.id, e);
      }

      return {
        ...order,
        items: itemsParsed
      };
    });

    res.json(formattedResults);
  });
});

// -------------------------
// Start server
// -------------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

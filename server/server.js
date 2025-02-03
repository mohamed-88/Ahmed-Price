const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'ahmed',
  password: 'ahmed123',
  database: 'ahmed',
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected.');
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Upload image and save to database
app.post('/upload', upload.single('image'), (req, res) => {
  const username = req.body.username;
  const caption = req.body.caption || ''; // دابینکردنی caption
  const imagePath = `/uploads/${req.file.filename}`;
  
  const sql = 'INSERT INTO ahmed_price (username, image_path, caption) VALUES (?, ?, ?)';
  db.query(sql, [username, imagePath, caption], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Image uploaded successfully!', id: result.insertId });
  });
});

// Get all uploaded images
app.get('/images', (req, res) => {
  const sql = 'SELECT * FROM ahmed_price';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Edit image username
app.put('/images/update-username/:id', (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  const sql = 'UPDATE ahmed_price SET username = ? WHERE id = ?';
  db.query(sql, [username, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'username updated successfully' });
  });
});


// Edit image caption
// app.put('/images/:id', (req, res) => {
//   const { id } = req.params;
//   const { caption } = req.body; // تەنیا caption وەردەگیرێت

//   const sql = 'UPDATE ahmed_price SET caption = ? WHERE id = ?';
//   db.query(sql, [caption, id], (err, result) => {
//     if (err) return res.status(500).send(err);
//     res.json({ message: 'Caption updated successfully' });
//   });
// });

// Delete image
app.delete("/images/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM ahmed_price WHERE id = ?", [id]);
  res.json({ message: "Image deleted successfully" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

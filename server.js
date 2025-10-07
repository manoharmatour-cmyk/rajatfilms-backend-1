const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('uploads'));

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/upload', upload.single('video'), (req, res) => {
  res.json({
    message: 'Video uploaded successfully!',
    url: `${req.protocol}://${req.get('host')}/${req.file.filename}`
  });
});

app.get('/videos', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.status(500).json({ error: 'Cannot list videos' });
    res.json(files);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

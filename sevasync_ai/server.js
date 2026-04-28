require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const sosRoutes = require('./routes/sosRoutes');

const app = express();


app.use(cors());
app.use(express.json());


const uploadsPath = path.join(__dirname, 'uploads');
const postsPath = path.join(uploadsPath, 'posts');
const evidencePath = path.join(uploadsPath, 'evidence');

[uploadsPath, postsPath, evidencePath].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`📁 Created folder: ${folder}`);
  }
});


app.use('/uploads', express.static(uploadsPath));


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/sos', sosRoutes);


app.get('/', (req, res) => {
  res.send("✅ SevaSync AI Server is Running...");
});


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });


app.use((err, req, res, next) => {
  console.error("🚨 GLOBAL ERROR:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const geminiRoutes = require('./routes/geminiRoutes');

app.use('/api/ai', geminiRoutes);
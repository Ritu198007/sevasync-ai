const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const { generateDescription } = require('../utils/gemini');

// ===============================
// 1. ENSURE UPLOAD FOLDER EXISTS
// ===============================
const uploadPath = path.join(__dirname, '..', 'uploads', 'posts');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Created uploads/posts folder");
}

// ===============================
// 2. SETUP MULTER STORAGE
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `POST-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ===============================
// 3. GET ALL POSTS
// ===============================
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ GET POSTS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// ===============================
// 4. CREATE NORMAL POST
// ===============================
router.post('/', upload.single('image'), async (req, res) => {
  const { title, category, lat, lng, address } = req.body;

  try {
    // 🧠 Safe Gemini AI call
    let description = "No AI description available";
    try {
      description = await generateDescription(title);
    } catch (err) {
      console.log("⚠️ Gemini failed:", err.message);
    }

    const newPost = new Post({
      title,
      category,
      description,
      image: req.file ? req.file.filename : null,
      isEmergency: false,
      status: 'Reported',
      location: {
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
        address
      }
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);

  } catch (err) {
    console.error("❌ CREATE POST ERROR:", err.message);
    res.status(400).json({ message: "Failed to create post" });
  }
});

// ===============================
// 5. SOS EMERGENCY POST
// ===============================
router.post('/sos', async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const newSOS = new Post({
      title: "🚨 EMERGENCY SOS TRIGGERED",
      category: "Emergency",
      description: `IMMEDIATE ASSISTANCE REQUIRED at ${lat}, ${lng}`,
      isEmergency: true,
      status: 'Reported',
      location: { lat, lng }
    });

    const savedSOS = await newSOS.save();
    res.status(201).json(savedSOS);

  } catch (err) {
    console.error("❌ SOS ERROR:", err.message);
    res.status(400).json({ message: "SOS ingestion failed" });
  }
});

// ===============================
// 6. UPDATE POST STATUS
// ===============================
router.patch('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err.message);
    res.status(400).json({ message: "Status update failed" });
  }
});

// ===============================
// 7. DELETE POST
// ===============================
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed from system" });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err.message);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
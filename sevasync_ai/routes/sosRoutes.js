const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, '..', 'uploads', 'evidence');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log("📁 Created uploads/evidence folder");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `SOS-${Date.now()}-${file.originalname}.webm`);
    }
});

const upload = multer({ storage });

router.post('/trigger', upload.single('video'), async (req, res) => {
    try {
        const { lat, lng, category = "General" } = req.body;

        const volunteerEmails = [
            "madyasha32@gmail.com",
            "rmohapatra0715@gmail.com",
            "gourangajayanti1@gmail.com",
            "satyabratamahakud612@gmail.com"
        ];

        console.log("*****************************************");
        console.log("🚨 SOS ACTIVATED!");
        console.log(`🚨 Type: ${category}`);
        console.log(`📍 Location: ${lat}, ${lng}`);

        if (req.file) {
            console.log(`📹 Video Saved: ${req.file.filename}`);
        } else {
            console.log("⚠️ No video uploaded");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: volunteerEmails.join(','),
            subject: `🚨 ${category} Emergency Alert - SevaSync AI`,
            html: `
                <div style="font-family: sans-serif; border: 3px solid red; padding: 20px; border-radius: 10px; max-width: 600px;">
                    <h1 style="color: red;">🚨 Emergency Alert</h1>
                    <p><b>🚨 Type:</b> ${category}</p>
                    <p>A user has triggered an SOS and needs immediate assistance.</p>
                    <hr>
                    <p><b>📍 Location:</b> 
                        <a href="${googleMapsLink}" target="_blank" style="color: #007bff; font-weight: bold;">
                        View on Google Maps
                        </a>
                    </p>
                    <p><b>🌐 Coordinates:</b> ${lat}, ${lng}</p>
                    <p><b>⏰ Time:</b> ${new Date().toLocaleString('en-IN')}</p>
                    <hr>
                    <p style="font-size: 0.9em; color: #555;">
                        ${req.file 
                            ? "📹 Evidence video has been recorded and stored in the system."
                            : "⚠️ No video evidence was captured."}
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        console.log("✅ Emails sent successfully!");
        console.log("*****************************************");

        res.status(200).json({
            success: true,
            message: `${category} SOS sent successfully`
        });

    } catch (error) {
        console.error("❌ BACKEND ERROR:", error.message);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
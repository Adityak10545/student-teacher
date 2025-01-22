const express = require("express");
const multer = require("multer");
const Material = require("../models/Material");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads"); // Correct relative path
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Include original name for better readability
    },
});

const upload = multer({ storage });

// GET /api/materials - Fetch all materials
router.get("/", async (req, res) => {
    try {
        const materials = await Material.find(); // Fetch all materials
        res.status(200).json({ materials }); // Respond with success
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch materials. Please try again later.",
        });
    }
});

// POST /api/materials/upload - Upload a new material
router.post("/upload", upload.single("file"), async (req, res) => {
    const { title } = req.body;
    const file = req.file;

    if (!title || !file) {
        return res.status(400).json({ error: "Title and file are required." });
    }

    try {
        // Save material information to the database
        const material = new Material({
            title,
            url: `/uploads/${file.filename}`, // Save URL relative to the static path
        });

        await material.save();
        res.status(201).json({
            message: "Material uploaded successfully.",
            material: { title: material.title, url: material.url },
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to upload material. Please try again later.",
        });
    }
});

// GET /api/materials/download/:id - Download material by ID
router.get("/download/:id", async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ error: "Material not found." });
        }

        const filePath = path.join(
            __dirname,
            "../uploads",
            path.basename(material.url)
        );
        if (!fs.existsSync(filePath)) {
            return res
                .status(404)
                .json({ error: "File not found on the server." });
        }

        // Use res.download to send the file to the client
        res.download(filePath, material.title, (err) => {
            if (err) {
                res.status(500).json({
                    error: "Failed to download the file. Please try again later.",
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            error: "Error retrieving material. Please try again later.",
        });
    }
});

module.exports = router;

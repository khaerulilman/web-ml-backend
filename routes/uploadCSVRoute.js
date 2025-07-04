const express = require("express");
const router = express.Router();
const { uploadCSV, upload } = require("../controllers/uploadCSV");
const authMiddleware = require("../middlewares/auth");

// Gunakan auth middleware untuk semua routes
router.use(authMiddleware);

// Route untuk upload CSV
// POST /api/datasets/upload-csv
router.post("/upload-csv", upload.single("csvFile"), uploadCSV);

module.exports = router;

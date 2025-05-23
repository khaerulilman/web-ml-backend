const express = require("express");
const authRoutes = require("./authRoutes");
const datasetRoutes = require("./datasetRoute");

const router = express.Router();

// kumpulan routes
router.use("/", authRoutes);
router.use("/datasets", datasetRoutes); // Menambahkan route untuk datasets

module.exports = router;

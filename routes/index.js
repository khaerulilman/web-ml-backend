const express = require("express");
const authRoutes = require("./authRoutes");
const datasetRoutes = require("./datasetRoute");
const uploadCSVRoutes = require("./uploadCSVRoute");

const router = express.Router();

// kumpulan routes
router.use("/", authRoutes);
router.use("/datasets", datasetRoutes); // Route untuk datasets biasa
router.use("/datasets", uploadCSVRoutes); // Route untuk upload CSV

module.exports = router;

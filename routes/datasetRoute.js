// routes/datasetRoutes.js - Example route setup
const express = require("express");
const router = express.Router();
const datasetController = require("../controllers/datasetController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/", datasetController.getAllDatasets);
router.get("/:id", datasetController.getDatasetById);
router.post("/", datasetController.createDataset);
router.put("/:id", datasetController.updateDataset);
router.delete("/:id", datasetController.deleteDataset);

module.exports = router;

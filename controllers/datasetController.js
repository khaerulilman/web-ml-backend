// controllers/datasetController.js
const datasetService = require("../services/datasetService");

const datasetController = {
  getAllDatasets: async (req, res) => {
    try {
      // Get datasets for authenticated user only
      const datasets = await datasetService.getAllDatasetsByUser(req.userId);
      res.status(200).json(datasets);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      res
        .status(500)
        .json({ message: "Error fetching datasets", error: error.message });
    }
  },

  getDatasetById: async (req, res) => {
    const { id } = req.params;
    try {
      // Ensure user can only access their own datasets
      const dataset = await datasetService.getDatasetByIdAndUser(
        id,
        req.userId
      );
      res.status(200).json(dataset);
    } catch (error) {
      console.error("Error fetching dataset:", error);
      if (
        error.message === "Dataset not found" ||
        error.message === "Access denied"
      ) {
        return res.status(404).json({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "Error fetching dataset", error: error.message });
    }
  },

  createDataset: async (req, res) => {
    try {
      // Validasi input dasar
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is required" });
      }

      // Validasi field yang diperlukan (userId tidak perlu dari body karena dari token)
      const { data } = req.body;
      if (!data) {
        return res.status(400).json({
          message: "Missing required field: data is required",
        });
      }

      // Use userId from token automatically
      const datasetData = {
        ...req.body,
        userId: req.userId, // Override dengan userId dari token
      };

      const newDataset = await datasetService.createDataset(datasetData);
      res.status(201).json(newDataset);
    } catch (error) {
      console.error("Error creating dataset:", error);
      res.status(500).json({
        message: "Error creating dataset",
        error: error.message,
      });
    }
  },

  updateDataset: async (req, res) => {
    const { id } = req.params;
    try {
      // Ensure user can only update their own datasets
      const updatedDataset = await datasetService.updateDatasetByUser(
        id,
        req.body,
        req.userId
      );
      res.status(200).json(updatedDataset);
    } catch (error) {
      console.error("Error updating dataset:", error);
      if (
        error.message === "Dataset not found" ||
        error.message === "Access denied"
      ) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error updating dataset",
        error: error.message,
      });
    }
  },

  deleteDataset: async (req, res) => {
    const { id } = req.params;
    try {
      // Ensure user can only delete their own datasets
      await datasetService.deleteDatasetByUser(id, req.userId);
      res.status(200).json({ message: "Dataset deleted successfully" });
    } catch (error) {
      console.error("Error deleting dataset:", error);
      if (
        error.message === "Dataset not found" ||
        error.message === "Access denied"
      ) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error deleting dataset",
        error: error.message,
      });
    }
  },
};

module.exports = datasetController;

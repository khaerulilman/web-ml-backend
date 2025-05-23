// services/datasetService.js
const datasetRepository = require("../repositories/datasetRepository");

const datasetService = {
  getAllDatasets: async () => {
    try {
      const datasets = await datasetRepository.findAll();
      return datasets;
    } catch (error) {
      console.error("Service - Error fetching datasets:", error);
      throw error;
    }
  },

  getAllDatasetsByUser: async (userId) => {
    try {
      const datasets = await datasetRepository.findByUserId(userId);
      return datasets;
    } catch (error) {
      console.error("Service - Error fetching user datasets:", error);
      throw error;
    }
  },

  getDatasetById: async (id) => {
    try {
      const dataset = await datasetRepository.findById(id);
      if (!dataset) {
        throw new Error("Dataset not found");
      }
      return dataset;
    } catch (error) {
      console.error("Service - Error fetching dataset:", error);
      throw error;
    }
  },

  getDatasetByIdAndUser: async (id, userId) => {
    try {
      const dataset = await datasetRepository.findByIdAndUserId(id, userId);
      if (!dataset) {
        throw new Error("Dataset not found");
      }
      return dataset;
    } catch (error) {
      console.error("Service - Error fetching dataset:", error);
      throw error;
    }
  },

  createDataset: async (data) => {
    try {
      // Validasi data sebelum create
      if (!data.userId || !data.data) {
        throw new Error("Missing required fields: userId and data");
      }

      const newDataset = await datasetRepository.create(data);
      return newDataset;
    } catch (error) {
      console.error("Service - Error creating dataset:", error);
      throw error;
    }
  },

  updateDataset: async (id, data) => {
    try {
      const existingDataset = await datasetRepository.findById(id);
      if (!existingDataset) {
        throw new Error("Dataset not found");
      }

      const updatedDataset = await datasetRepository.update(id, data);
      return updatedDataset;
    } catch (error) {
      console.error("Service - Error updating dataset:", error);
      throw error;
    }
  },

  updateDatasetByUser: async (id, data, userId) => {
    try {
      const existingDataset = await datasetRepository.findByIdAndUserId(
        id,
        userId
      );
      if (!existingDataset) {
        throw new Error("Dataset not found");
      }

      const updatedDataset = await datasetRepository.update(id, data);
      return updatedDataset;
    } catch (error) {
      console.error("Service - Error updating dataset:", error);
      throw error;
    }
  },

  deleteDataset: async (id) => {
    try {
      const existingDataset = await datasetRepository.findById(id);
      if (!existingDataset) {
        throw new Error("Dataset not found");
      }

      const deletedDataset = await datasetRepository.delete(id);
      return deletedDataset;
    } catch (error) {
      console.error("Service - Error deleting dataset:", error);
      throw error;
    }
  },

  deleteDatasetByUser: async (id, userId) => {
    try {
      const existingDataset = await datasetRepository.findByIdAndUserId(
        id,
        userId
      );
      if (!existingDataset) {
        throw new Error("Dataset not found");
      }

      const deletedDataset = await datasetRepository.delete(id);
      return deletedDataset;
    } catch (error) {
      console.error("Service - Error deleting dataset:", error);
      throw error;
    }
  },
};

module.exports = datasetService;

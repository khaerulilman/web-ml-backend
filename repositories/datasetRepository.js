// repositories/datasetRepository.js
const { prisma } = require("../config/db");

const datasetRepository = {
  findAll: async () => {
    try {
      return await prisma.datasets.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Repository - Error finding all datasets:", error);
      throw error;
    }
  },

  findByUserId: async (userId) => {
    try {
      return await prisma.datasets.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Repository - Error finding datasets by user:", error);
      throw error;
    }
  },

  findById: async (id) => {
    try {
      return await prisma.datasets.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Repository - Error finding dataset by id:", error);
      throw error;
    }
  },

  findByIdAndUserId: async (id, userId) => {
    try {
      return await prisma.datasets.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error(
        "Repository - Error finding dataset by id and user:",
        error
      );
      throw error;
    }
  },

  create: async (data) => {
    try {
      return await prisma.datasets.create({
        data: {
          userId: data.userId,
          data: data.data,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Repository - Error creating dataset:", error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await prisma.datasets.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Repository - Error updating dataset:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await prisma.datasets.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Repository - Error deleting dataset:", error);
      throw error;
    }
  },
};

module.exports = datasetRepository;

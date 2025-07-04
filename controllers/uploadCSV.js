const { prisma } = require("../config/db");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    // Buat folder uploads jika belum ada
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("File harus berformat CSV"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const uploadCSV = async (req, res) => {
  try {
    // Ambil userId dari auth middleware (JWT token)
    const userId = req.user.id;

    // Validasi userId (seharusnya sudah ada dari auth middleware)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User ID tidak ditemukan",
      });
    }

    // Cek apakah user exists
    const userExists = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Cek apakah file ada
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File CSV diperlukan",
      });
    }

    const filePath = req.file.path;

    try {
      // Baca file CSV mentah untuk mendapat data association rules
      const rawData = fs.readFileSync(filePath, "utf8");
      const lines = rawData.split("\n").filter((line) => line.trim() !== "");

      if (lines.length === 0) {
        fs.unlinkSync(filePath); // Hapus file
        return res.status(400).json({
          success: false,
          message: "File CSV kosong",
        });
      }

      // Ambil header (baris pertama) dan data
      const header = lines[0].replace(/^\uFEFF/, "").trim(); // Remove BOM if exists
      const dataLines = lines.slice(1).filter((line) => line.trim() !== "");

      // Validasi minimal ada 1 baris data
      if (dataLines.length === 0) {
        fs.unlinkSync(filePath); // Hapus file
        return res.status(400).json({
          success: false,
          message: "File CSV hanya berisi header, tidak ada data",
        });
      }

      // Siapkan data untuk bulk insert
      const datasetsToInsert = dataLines.map((line) => ({
        userId: userId,
        data: line.trim(),
      }));

      // Bulk insert ke database menggunakan createMany
      const result = await prisma.datasets.createMany({
        data: datasetsToInsert,
        skipDuplicates: true, // Skip jika ada duplikat
      });

      // Ambil beberapa data yang baru saja diinsert untuk preview
      const recentDatasets = await prisma.datasets.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "desc" },
        take: Math.min(5, dataLines.length), // Ambil max 5 record terakhir
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

      // Hapus file setelah berhasil diproses
      fs.unlinkSync(filePath);

      res.status(201).json({
        success: true,
        message: `CSV berhasil diupload dan diproses. ${result.count} record berhasil ditambahkan.`,
        data: {
          totalInserted: result.count,
          totalLines: dataLines.length,
          columnName: header,
          sampleData: recentDatasets.map((dataset) => ({
            id: dataset.id,
            data: dataset.data,
            createdAt: dataset.createdAt,
          })),
          user: recentDatasets[0]?.user || userExists,
        },
      });
    } catch (error) {
      console.error("Processing error:", error);
      fs.unlinkSync(filePath); // Hapus file jika terjadi error

      if (error.code === "P2002") {
        // Prisma unique constraint error
        res.status(400).json({
          success: false,
          message: "Beberapa data sudah ada di database",
          error: "Duplicate data found",
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Gagal memproses atau menyimpan data",
          error: error.message,
        });
      }
    }
  } catch (error) {
    console.error("Upload error:", error);

    // Hapus file jika ada dan terjadi error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat upload",
      error: error.message,
    });
  }
};

module.exports = {
  uploadCSV,
  upload, // Export middleware multer
};

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection configuration
const connectionString =
  process.env.MONGODB_URI ||
  "mongodb+srv://dhruvpatel150204:internship123@cluster0.ec2du.mongodb.net/";
const DATABASE_NAME = "SIH";

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// PDF Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      return cb(new Error("Only PDFs are allowed"), false);
    }
    cb(null, true);
  },
});

// MongoDB Connection Function
async function connectToDatabase() {
  try {
    const client = new MongoClient(connectionString);
    await client.connect();
    console.log("Connected to MongoDB successfully");
    return client.db(DATABASE_NAME);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
}

// Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
  });
};

// PDF Upload Route
app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    const db = await connectToDatabase();
    const pdfsCollection = db.collection("pdfs");

    const newPdfDocument = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      uploadedAt: new Date(),
      size: req.file.size,
    };

    const result = await pdfsCollection.insertOne(newPdfDocument);

    res.status(201).json({
      success: true,
      message: "PDF uploaded successfully",
      fileId: result.insertedId,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("PDF Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload PDF",
      error: error.message,
    });
  }
});

// Route to fetch PDF files
app.get("/api/pdf-files", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const pdfsCollection = db.collection("pdfs");
    
    const pdfDocuments = await pdfsCollection.find({}).toArray();
    console.log(pdfDocuments);
    const pdfFiles = pdfDocuments.map((doc) => ({
      id: doc._id.toString(),
      filename: doc.originalName || doc.filename,
      uploadedAt: doc.uploadedAt,
      fullPath: `/uploads/${doc.filename}`,
    }));

    res.json({
      success: true,
      count: pdfFiles.length,
      files: pdfFiles,
    });
  } catch (error) {
    console.error("PDF Files Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch PDF files",
      error: error.message,
    });
  }
});

// YouTube Links Route
app.post("/api/add-youtube-link", async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({
        success: false,
        message: "YouTube link is required",
      });
    }

    const db = await connectToDatabase();
    const transcriptsCollection = db.collection("transcripts");

    const existingLink = await transcriptsCollection.findOne({ yt_link: link });
    if (existingLink) {
      return res.status(409).json({
        success: false,
        message: "YouTube link already exists",
      });
    }

    const newYouTubeLink = {
      yt_link: link,
      addedAt: new Date(),
    };

    const result = await transcriptsCollection.insertOne(newYouTubeLink);

    res.status(201).json({
      success: true,
      message: "YouTube link added successfully",
      linkId: result.insertedId,
    });
  } catch (error) {
    console.error("YouTube Link Add Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add YouTube link",
      error: error.message,
    });
  }
});

// Route to fetch YouTube links
app.get("/api/youtube-links", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const transcriptsCollection = db.collection("transcripts");

    const youtubeLinks = await transcriptsCollection.find({}).toArray();

    const formattedLinks = youtubeLinks.map((doc) => ({
      id: doc._id.toString(),
      link: doc.yt_link,
      addedAt: doc.addedAt,
    }));

    res.json({
      success: true,
      count: formattedLinks.length,
      links: formattedLinks,
    });
  } catch (error) {
    console.error("YouTube Links Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch YouTube links",
      error: error.message,
    });
  }
});

// Combined route to fetch both PDF files and YouTube links
app.get("/api/all-data", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const pdfsCollection = db.collection("pdfs");
    const transcriptsCollection = db.collection("transcripts");

    const pdfPromise = pdfsCollection.find({}).toArray();
    const youtubePromise = transcriptsCollection.find({}).toArray();

    const [pdfDocuments, youtubeDocuments] = await Promise.all([
      pdfPromise,
      youtubePromise,
    ]);

    const pdfFiles = pdfDocuments.map((doc) => ({
      id: doc._id.toString(),
      type: "PDF",
      filename: doc.originalName || doc.filename,
      uploadedAt: doc.uploadedAt,
      fullPath: `/uploads/${doc.filename}`,
    }));

    const youtubeLinks = youtubeDocuments.map((doc) => ({
      id: doc._id.toString(),
      type: "YouTube",
      link: doc.yt_link,
      addedAt: doc.addedAt,
    }));

    res.json({
      success: true,
      resources: [...pdfFiles, ...youtubeLinks],
    });
  } catch (error) {
    console.error("Combined Data Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch combined data",
      error: error.message,
    });
  }
});

// Delete Resource Route
app.delete("/api/delete-resource/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const pdfsCollection = db.collection("pdfs");
    const transcriptsCollection = db.collection("transcripts");

    // Try deleting from PDFs collection
    const pdfResult = await pdfsCollection.deleteOne({ _id: new ObjectId(id) });

    if (pdfResult.deletedCount > 0) {
      return res.json({
        success: true,
        message: "PDF resource deleted successfully",
      });
    }

    // If not found in PDFs, try deleting from YouTube links
    const youtubeResult = await transcriptsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (youtubeResult.deletedCount > 0) {
      return res.json({
        success: true,
        message: "YouTube link deleted successfully",
      });
    }

    res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  } catch (error) {
    console.error("Resource Deletion Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resource",
      error: error.message,
    });
  }
});

// Global Error Handler Middleware
app.use(errorHandler);

// Server Startup
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

// Graceful Shutdown
const gracefulShutdown = () => {
  console.log("🔄 Initiating graceful shutdown...");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Start the server
startServer();

module.exports = app;

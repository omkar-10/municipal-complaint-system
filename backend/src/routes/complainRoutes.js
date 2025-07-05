import express from "express";
import {
  createComplaint,
  deleteComplaint,
  updateComplaint,
  getMyComplaints,
  getAllComplaints,
  rejectComplaint,
  markResolved,
  getComplaintById,
} from "../controllers/complaintController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Citizen routes
router.post("/", protect, upload.single("image"), createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/:id", protect, getComplaintById);

// Update complaint (only by owner)
router.put("/:id", protect, upload.single("image"), updateComplaint);

// Delete complaint (only by owner)
router.delete("/:id", protect, deleteComplaint);

// Admin routes
router.get("/", protect, adminOnly, getAllComplaints);
router.put("/:id/resolve", protect, adminOnly, markResolved);
router.put("/:id/reject", protect, adminOnly, rejectComplaint);

export default router;

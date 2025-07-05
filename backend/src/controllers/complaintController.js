import Complaint from "../models/Complain.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(complaint);
  } catch (error) {
    console.error("Error in getComplaintById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createComplaint = async (req, res) => {
  try {
    const { title, description, urgency, anonymous, location } = req.body;

    const imageUrl = req.file ? req.file.secure_url : "";
    const isAnonymous = anonymous === "true" || anonymous === true;

    const complaint = new Complaint({
      title,
      description,
      location,
      urgency,
      imageUrl,
      user: req.user._id,
      anonymous: isAnonymous,
      visibleToAdmin: !isAnonymous,
    });

    const user = await User.findById(req.user.id);

    await sendEmail(
      user.email,
      "Complaint Submitted – MBMC Helpdesk",
      `Hi ${user.name}, your complaint has been submitted.`,
      `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWyELeC-GcbNeC4OGWqZxmk0NJwYonRLO81A&s" alt="MBMC Logo" width="80" style="margin-bottom: 15px;" />
    </div>
    <h2 style="color: #2d7b9a; text-align: center;">Municipal Complaint Submission Confirmation</h2>
    <p>Dear <strong>${user.name}</strong>,</p>
    <p>Thank you for submitting your complaint to the <strong>Municipal Corporation</strong>. Below are the details of your submission:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <tr><td style="padding: 8px; font-weight: bold;">Title:</td><td style="padding: 8px;">${title}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Description:</td><td style="padding: 8px;">${description}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Urgency:</td><td style="padding: 8px;">${urgency}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${location}</td></tr>
    </table>
    <p>Our team will review your complaint and take the necessary action as per the urgency level. You will be notified once the status is updated.</p>
    <p style="margin-top: 30px; font-size: 14px; color: gray;">Regards,<br/><strong>Municipal Helpdesk</strong><br/>Municipal Corporation</p>
  </div>
  `
    );

    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    console.error("❌ Complaint creation error:", err);
    res
      .status(500)
      .json({ message: "Error creating complaint", error: err.message });
  }
};

export const getMyComplaints = async (req, res) => {
  const complaints = await Complaint.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(complaints);
};

export const getAllComplaints = async (req, res) => {
  try {
    const { status, urgency, sort, location } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (location) filter.location = location;

    let query = Complaint.find(filter).populate("user", "name");

    if (sort === "newest") query = query.sort({ createdAt: -1 });
    else if (sort === "oldest") query = query.sort({ createdAt: 1 });
    else query = query.sort({ createdAt: -1 });

    const complaints = await query;
    res.json(complaints);
  } catch (err) {
    console.error("❌ Error fetching complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (complaint.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await complaint.deleteOne();
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { title, description, urgency, location, anonymous } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (complaint.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    complaint.urgency = urgency || complaint.urgency;
    complaint.location = location || complaint.location;
    complaint.anonymous = anonymous ?? complaint.anonymous;

    if (req.file) {
      complaint.imageUrl = req.file.secure_url;
    }

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markResolved = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.status = "Resolved";
    await complaint.save();

    await sendEmail(
      complaint.user.email,
      "Complaint Resolved – MBMC Helpdesk",
      `Hi ${complaint.user.name}, your complaint has been resolved.`,
      `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 10px;">
    <div style="text-align: center;">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWyELeC-GcbNeC4OGWqZxmk0NJwYonRLO81A&s" alt="MBMC Logo" width="80" style="margin-bottom: 15px;" />
    </div>
    <h2 style="color: #2d7b9a; text-align: center;">Complaint Resolution Notification</h2>
    <p>Dear <strong>${complaint.user.name}</strong>,</p>
    <p>Your complaint titled <strong>${complaint.title}</strong> has been marked as <span style="color: green;">Resolved</span>.</p>
    <p>We appreciate your input and encourage you to report any future concerns.</p>
    <p style="margin-top: 30px; font-size: 14px; color: gray;">Regards,<br/><strong>MBMC Helpdesk</strong><br/>Municipal Corporation</p>
  </div>
  `
    );

    res.json({ message: "Complaint marked as resolved ✅" });
  } catch (err) {
    console.error("❌ Error resolving complaint:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.status = "Rejected";
    await complaint.save();

    if (complaint.user) {
      await sendEmail(
        complaint.user.email,
        "Complaint Rejected – Municipal Helpdesk",
        `Hi ${complaint.user.name}, your complaint was rejected.`,
        `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; border-radius: 10px;">
      <div style="text-align: center;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWyELeC-GcbNeC4OGWqZxmk0NJwYonRLO81A&s" alt="MBMC Logo" width="80" style="margin-bottom: 15px;" />
      </div>
      <h2 style="color: #2d7b9a; text-align: center;">Complaint Review Outcome</h2>
      <p>Dear <strong>${complaint.user.name}</strong>,</p>
      <p>Your complaint titled <strong>${complaint.title}</strong> has been <span style="color: red;">Rejected</span>.</p>
      <p>If you believe this was an error, feel free to resubmit with more details.</p>
      <p style="margin-top: 30px; font-size: 14px; color: gray;">Regards,<br/><strong>MBMC Helpdesk</strong><br/>Municipal Corporation</p>
    </div>
    `
      );
    }

    res.json({ message: "Complaint rejected" });
  } catch (err) {
    console.error("❌ Error rejecting complaint:", err);
    res.status(500).json({ message: "Server error" });
  }
};

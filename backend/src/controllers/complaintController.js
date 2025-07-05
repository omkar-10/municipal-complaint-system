import Complaint from "../models/Complain.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";
import { bufferToDataURI } from "../utils/dataUri.js";

// Helper function to upload image buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "complaints" }, (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};

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
    const isAnonymous = anonymous === "true" || anonymous === true;

    let imageUrl = "";

    if (req.file) {
      const fileFormat = req.file.mimetype.split("/")[1];
      const fileStr = bufferToDataURI(fileFormat, req.file.buffer);

      const uploadResult = await cloudinary.uploader.upload(fileStr, {
        folder: "municipal_complaints",
      });

      imageUrl = uploadResult.secure_url;
    }

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
      "Complaint Submitted – Municipal Helpdesk",
      `Dear ${user.name}, your complaint has been successfully submitted.`,
      `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWyELeC-GcbNeC4OGWqZxmk0NJwYonRLO81A&s" alt="Municipal Logo" width="80" style="margin-bottom: 16px;" />
      </div>

      <h2 style="color: #1e3a8a; text-align: center; font-size: 22px; margin-bottom: 20px;">
        Complaint Submission Confirmation
      </h2>

      <p style="font-size: 16px; color: #333;">To,<br/>
      <strong>${user.name}</strong></p>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
        Thank you for raising your concern through the official Municipal Complaint System.
        The following details have been recorded for your reference:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;">
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9;">Title</td>
          <td style="padding: 8px;">${title}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9;">Description</td>
          <td style="padding: 8px;">${description}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9;">Urgency</td>
          <td style="padding: 8px;">${urgency}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; background-color: #f1f5f9;">Location</td>
          <td style="padding: 8px;">${location}</td>
        </tr>
      </table>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
        The concerned department will review your complaint and initiate necessary action based on the reported urgency. You will receive an update regarding the status in due course.
      </p>

      <p style="font-size: 14px; color: #555; margin-top: 30px;">
        For queries or additional information, please feel free to reach out through the helpdesk portal.
      </p>

      <p style="font-size: 14px; color: #444; margin-top: 35px;">
        Regards,<br/>
        <strong>Municipal Helpdesk Team</strong><br/>
        Municipal Corporation
      </p>
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
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      complaint.imageUrl = uploadedImage;
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
      "Complaint Resolved – Municipal Helpdesk",
      `Dear ${complaint.user.name}, your complaint has been resolved.`,
      `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px; background-color: #f9f9f9;">
      <div style="text-align: center;">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWyELeC-GcbNeC4OGWqZxmk0NJwYonRLO81A&s" alt="Municipal Logo" width="80" style="margin-bottom: 16px;" />
      </div>

      <h2 style="color: #1e3a8a; text-align: center; font-size: 22px; margin-bottom: 20px;">
        Complaint Resolution Acknowledgement
      </h2>

      <p style="font-size: 16px; color: #333;">To,<br/>
      <strong>${complaint.user.name}</strong></p>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
        We are pleased to inform you that your complaint titled <strong>"${complaint.title}"</strong> has been successfully reviewed and marked as <strong style="color: green;">Resolved</strong> by the municipal team.
      </p>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
        Your cooperation is sincerely appreciated. Should you face any further issues or wish to raise another concern, we encourage you to do so through the municipal complaint system.
      </p>

      <p style="font-size: 14px; color: #555; line-height: 1.6; margin-top: 30px;">
        For any clarification or support, you may contact the local helpdesk or reply to this communication.
      </p>

      <p style="font-size: 14px; color: #444; margin-top: 35px;">
        Regards,<br/>
        <strong>Municipal Helpdesk Team</strong><br/>
        Municipal Corporation
      </p>
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
        "Municipal Helpdesk – Complaint Rejected Notification",
        `Dear ${complaint.user.name}, your complaint has been reviewed and rejected.`,
        `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #d3d3d3; padding: 24px; border-radius: 8px; background-color: #f9f9f9;">
    <div style="text-align: center;">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWyELeC-GcbNeC4OGWqZxmk0NJwYonRLO81A&s" alt="MBMC Logo" width="80" style="margin-bottom: 16px;" />
    </div>
    <h2 style="color: #1e3a8a; text-align: center; font-size: 22px; margin-bottom: 20px;">Municipal Helpdesk Notification</h2>
    <p style="font-size: 16px; color: #333;">To,<br/>
    <strong>${complaint.user.name}</strong></p>

    <p style="font-size: 16px; color: #333;">Subject: <strong>Status Update on Complaint – <em>${complaint.title}</em></strong></p>

    <p style="font-size: 15px; color: #333; line-height: 1.6;">
      We would like to inform you that your registered complaint with the title <strong>"${complaint.title}"</strong> has been reviewed by the concerned department and is marked as <strong style="color: #b91c1c;">Rejected</strong>.
    </p>

    <p style="font-size: 15px; color: #333; line-height: 1.6;">
      This decision has been taken after due assessment and consideration. If you believe this status is inaccurate or if you have additional information to support your complaint, we encourage you to resubmit the complaint with necessary clarifications or documentation.
    </p>

    <p style="font-size: 14px; color: #555; line-height: 1.6; margin-top: 30px;">
      For further queries or assistance, you may contact your local ward office or reply to this email.
    </p>

    <p style="font-size: 14px; color: #444; margin-top: 35px;">
      Sincerely,<br/>
      <strong>Municipal Helpdesk Team</strong><br/>
      Municipal Corporation
    </p>
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

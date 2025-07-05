import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/axiosInstance.js";
import Navbar from "../components/Navbar";
import { Link } from "react-router";

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [editedData, setEditedData] = useState({
    title: "",
    description: "",
    urgency: "Low",
    location: "",
    image: null,
  });
  const [filterStatus, setFilterStatus] = useState("All");
  const [isSaving, setIsSaving] = useState(false); // for spinner

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        const res = await api.get("/complaints/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data);
      } catch (err) {
        console.error("Error in fetchComplaint:", err);
        toast.error("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirm) return;

    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      await api.delete(`/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Complaint deleted successfully");
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error in handleDelete:", err);
      toast.error("Failed to delete complaint");
    }
  };

  const openEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setEditedData({
      title: complaint.title,
      description: complaint.description,
      urgency: complaint.urgency,
      location: complaint.location,
      image: null,
    });
  };

  const handleEditSave = async () => {
    try {
      setIsSaving(true);
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

      const formData = new FormData();
      formData.append("title", editedData.title);
      formData.append("description", editedData.description);
      formData.append("urgency", editedData.urgency);
      formData.append("location", editedData.location);
      if (editedData.image) {
        formData.append("image", editedData.image);
      }

      const updated = await api.put(
        `/complaints/${editingComplaint._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Complaint updated successfully");
      setEditingComplaint(null);
      setComplaints((prev) =>
        prev.map((c) => (c._id === editingComplaint._id ? updated.data : c))
      );
    } catch (err) {
      console.log("Error in handleEditSave:", err);
      toast.error("Failed to update complaint");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredComplaints =
    filterStatus === "All"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const urgencyColors = {
    Low: "bg-emerald-100 text-emerald-800",
    Medium: "bg-amber-100 text-amber-800",
    High: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    Resolved: <CheckCircle2 className="w-4 h-4" />,
    Rejected: <AlertTriangle className="w-4 h-4" />,
    Pending: <Clock className="w-4 h-4" />,
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={24} />
              Your Reported Issues
            </h2>
            <div className="w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select select-bordered w-full sm:w-auto"
              >
                <option value="All">All Complaints</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center">
              <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-500 mb-4 text-sm md:text-base">
                {complaints.length === 0
                  ? "Report an issue to get started"
                  : "Try selecting a different filter"}
              </p>
              <Link
                to="/citizen/complaints/new"
                className="btn btn-primary hidden sm:inline-flex"
              >
                Report New Issue
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredComplaints.map((complaint) => {
                const isEditable =
                  complaint.status !== "Resolved" &&
                  complaint.status !== "Rejected";

                return (
                  <Link
                    to={`/citizen/complaints/${complaint._id}`}
                    key={complaint._id}
                    className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md border border-gray-100 block"
                  >
                    {complaint.imageUrl && (
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <img
                          src={complaint.imageUrl}
                          alt="Complaint"
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                    )}

                    <div className="p-4 sm:p-5">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                          {complaint.title}
                        </h3>
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (isEditable) openEditModal(complaint);
                            }}
                            className={`btn btn-xs sm:btn-sm btn-ghost text-blue-600 ${
                              !isEditable && "btn-disabled"
                            }`}
                            disabled={!isEditable}
                            title={
                              isEditable
                                ? "Edit complaint"
                                : "Cannot edit resolved or rejected complaint"
                            }
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(complaint._id);
                            }}
                            className="btn btn-xs sm:btn-sm btn-ghost text-error"
                            aria-label="Delete complaint"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
                        {complaint.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{complaint.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            urgencyColors[complaint.urgency]
                          }`}
                        >
                          {complaint.urgency} Priority
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                            complaint.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : complaint.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {statusIcons[complaint.status] || statusIcons.Pending}
                          {complaint.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="sm:hidden fixed bottom-6 right-6 z-10">
          <Link
            to="/citizen/complaints/new"
            className="btn btn-circle btn-primary shadow-lg"
          >
            <Plus size={24} />
          </Link>
        </div>

        {/* ✅ Edit Modal */}
        {editingComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Edit Complaint
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="input input-bordered w-full"
                  value={editedData.title}
                  onChange={(e) =>
                    setEditedData({ ...editedData, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  value={editedData.description}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="input input-bordered w-full"
                  value={editedData.location}
                  onChange={(e) =>
                    setEditedData({ ...editedData, location: e.target.value })
                  }
                />
                <select
                  className="select select-bordered w-full"
                  value={editedData.urgency}
                  onChange={(e) =>
                    setEditedData({ ...editedData, urgency: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  accept="image/*"
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      image: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setEditingComplaint(null)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="btn btn-primary flex items-center gap-2"
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CitizenDashboard;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../utils/axiosInstance";
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  AlertCircle,
  CalendarDays,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        const res = await api.get(`/complaints/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaint(res.data);
      } catch (err) {
        console.error("Error in fetchComplaint:", err);
        toast.error("Failed to load complaint");
        navigate("/citizen/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  const getStatusDetails = (status) => {
    switch (status) {
      case "Resolved":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "bg-emerald-100 text-emerald-800",
          text: "Resolved",
        };
      case "Rejected":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: "bg-red-100 text-red-800",
          text: "Rejected",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "bg-amber-100 text-amber-800",
          text: "Pending",
        };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!complaint) return null;

  const statusDetails = getStatusDetails(complaint.status);
  const urgencyColor = getUrgencyColor(complaint.urgency);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate("/citizen/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            {complaint.imageUrl && (
              <div className="relative h-80 w-full overflow-hidden">
                <img
                  src={`http://localhost:5001${complaint.imageUrl}`}
                  alt="Complaint"
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {complaint.title}
                </h1>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${urgencyColor}`}
                  >
                    {complaint.urgency} Priority
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusDetails.color}`}
                  >
                    {statusDetails.icon}
                    {statusDetails.text}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none text-gray-600 mb-8">
                <p>{complaint.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Complaint Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">
                        {complaint.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">
                        Reported on{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {complaint.anonymous ? (
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          Submitted anonymously
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Status Updates
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">
                          Complaint submitted
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(complaint.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {complaint.status !== "Pending" && (
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">
                            Status updated to{" "}
                            <strong>{complaint.status}</strong>
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(complaint.updatedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplaintDetail;

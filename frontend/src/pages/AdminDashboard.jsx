import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  LogOut,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Image as ImageIcon,
  Clock,
  User,
  MapPin,
  Hash,
} from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Reduced for better mobile experience
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    rejected: 0,
  });
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
      setFilteredComplaints(res.data);

      setStats({
        total: res.data.length,
        pending: res.data.filter((c) => c.status === "Pending").length,
        resolved: res.data.filter((c) => c.status === "Resolved").length,
        rejected: res.data.filter((c) => c.status === "Rejected").length,
      });
    } catch (err) {
      console.error("Error in the fetchComplaints:", err);
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, action) => {
    setStatusUpdateLoading(action);
    const toastId = toast.loading(
      `${action === "resolve" ? "Resolving" : "Rejecting"} complaint...`
    );

    try {
      await api.put(
        `/complaints/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Complaint ${
          action === "resolve" ? "resolved" : "rejected"
        } successfully`,
        {
          id: toastId,
        }
      );
      fetchComplaints();
      setSelectedComplaint(null);
    } catch (err) {
      console.error("Error in the handleStatusUpdate:", err);
      toast.error("Update failed", {
        id: toastId,
      });
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  const applyFilters = () => {
    let result = complaints;

    if (statusFilter !== "All") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (urgencyFilter !== "All") {
      result = result.filter((c) => c.urgency === urgencyFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          (c.description && c.description.toLowerCase().includes(term))
      );
    }

    setFilteredComplaints(result);
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = () => {
    const sortableItems = [...filteredComplaints];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "createdAt") {
          return sortConfig.direction === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };

  const clearAllFilters = () => {
    setStatusFilter("All");
    setUrgencyFilter("All");
    setSearchTerm("");
    setSortConfig({ key: null, direction: "asc" });
    setCurrentPage(1);
  };

  const hasFilters =
    statusFilter !== "All" ||
    urgencyFilter !== "All" ||
    searchTerm !== "" ||
    sortConfig.key;

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, urgencyFilter, searchTerm, complaints]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return <span className="badge badge-success gap-1">Resolved</span>;
      case "Rejected":
        return <span className="badge badge-error gap-1">Rejected</span>;
      default:
        return <span className="badge badge-warning gap-1">Pending</span>;
    }
  };

  const sortedItems = getSortedItems();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-4 sm:p-6">
        {/* Stats Panel - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xs sm:text-sm text-gray-500">Total</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xs sm:text-sm text-gray-500">Pending</div>
            <div className="text-xl sm:text-2xl font-bold text-yellow-500">
              {stats.pending}
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xs sm:text-sm text-gray-500">Resolved</div>
            <div className="text-xl sm:text-2xl font-bold text-green-500">
              {stats.resolved}
            </div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-xs sm:text-sm text-gray-500">Rejected</div>
            <div className="text-xl sm:text-2xl font-bold text-red-500">
              {stats.rejected}
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Complaints
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {hasFilters && (
                <button
                  className="btn btn-sm btn-outline border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                  onClick={clearAllFilters}
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="select select-bordered select-sm sm:select-md w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency
                </label>
                <select
                  className="select select-bordered select-sm sm:select-md w-full"
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                >
                  <option value="All">All Levels</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner text-primary loading-lg"></span>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-sm sm:text-lg">
              No complaints found
            </div>
            <button
              className="btn btn-outline btn-sm sm:btn-md mt-4 gap-2"
              onClick={clearAllFilters}
            >
              <Filter className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-600">
                      <th className="font-medium p-2 sm:p-4">
                        <button
                          className="flex items-center gap-1 hover:text-gray-800 text-xs sm:text-sm"
                          onClick={() => requestSort("title")}
                        >
                          Title
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="font-medium p-2 sm:p-4 hidden sm:table-cell">
                        <button
                          className="flex items-center gap-1 hover:text-gray-800 text-xs sm:text-sm"
                          onClick={() => requestSort("urgency")}
                        >
                          Urgency
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="font-medium p-2 sm:p-4">
                        <button
                          className="flex items-center gap-1 hover:text-gray-800 text-xs sm:text-sm"
                          onClick={() => requestSort("status")}
                        >
                          Status
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="font-medium p-2 sm:p-4 hidden sm:table-cell">
                        <button
                          className="flex items-center gap-1 hover:text-gray-800 text-xs sm:text-sm"
                          onClick={() => requestSort("createdAt")}
                        >
                          Date
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="font-medium p-2 sm:p-4 text-right">
                        <span className="text-xs sm:text-sm">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((c) => (
                      <tr
                        key={c._id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          c.status === "Resolved" || c.status === "Rejected"
                            ? "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            : ""
                        }`}
                        onClick={() => setSelectedComplaint(c)}
                      >
                        <td className="p-2 sm:p-4">
                          <div className="font-medium text-gray-800 text-xs sm:text-sm">
                            {c.title.length > 30
                              ? `${c.title.substring(0, 30)}...`
                              : c.title}
                          </div>
                          <div className="text-gray-500 text-xs line-clamp-1 hidden sm:block">
                            {c.description}
                          </div>
                        </td>
                        <td className="p-2 sm:p-4 hidden sm:table-cell">
                          <span
                            className={`badge badge-sm ${
                              c.urgency === "High"
                                ? "badge-error"
                                : c.urgency === "Medium"
                                ? "badge-warning"
                                : "badge-info"
                            } gap-1`}
                          >
                            {c.urgency}
                          </span>
                        </td>
                        <td className="p-2 sm:p-4">
                          {getStatusBadge(c.status)}
                        </td>
                        <td className="p-2 sm:p-4 hidden sm:table-cell">
                          <span className="text-xs sm:text-sm">
                            {new Date(c.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="p-2 sm:p-4 text-right">
                          <button
                            className="btn btn-ghost btn-xs sm:btn-sm hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedComplaint(c);
                            }}
                          >
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">...</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination - Mobile Friendly */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <div className="join">
                  <button
                    className="join-item btn btn-sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  <button className="join-item btn btn-sm">
                    Page {currentPage} of {totalPages}
                  </button>
                  <button
                    className="join-item btn btn-sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Complaint Detail Modal - Mobile Friendly */}
      {selectedComplaint && (
        <div className="modal modal-open z-[100] backdrop-blur-sm">
          <div className="modal-box p-0 overflow-hidden w-full h-full max-h-screen rounded-none sm:rounded-lg sm:max-w-5xl sm:h-auto sm:max-h-[90vh] flex flex-col">
            <div className="bg-slate-800 p-4 text-white sticky top-0 z-10">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <h3 className="text-xl sm:text-2xl font-bold line-clamp-2">
                    {selectedComplaint.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        selectedComplaint.urgency === "High"
                          ? "bg-red-500"
                          : selectedComplaint.urgency === "Medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {selectedComplaint.urgency} Priority
                    </div>

                    <div
                      className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        selectedComplaint.status === "Resolved"
                          ? "bg-green-500"
                          : selectedComplaint.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {selectedComplaint.status}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/10 ml-2"
                  onClick={() => setSelectedComplaint(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Description Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2 sm:mb-3">
                    Description
                  </h4>
                  <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
                    {selectedComplaint.description}
                  </div>
                </div>

                {/* Metadata Cards - Stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Submitted</span>
                    </div>
                    <p className="font-medium text-sm sm:text-base">
                      {new Date(selectedComplaint.createdAt).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Location</span>
                    </div>
                    <p className="font-medium text-sm sm:text-base">
                      {selectedComplaint.location || "Not specified"}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <User className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Submitted By</span>
                    </div>
                    <p className="font-medium text-sm sm:text-base">
                      {selectedComplaint.anonymous
                        ? "Anonymous"
                        : selectedComplaint.user?.name || "Unknown"}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Hash className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Complaint ID</span>
                    </div>
                    <p className="font-mono text-xs sm:text-sm">
                      {selectedComplaint._id.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Evidence Section */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Evidence
                  </h4>
                  {selectedComplaint.imageUrl ? (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <a
                          href={selectedComplaint.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost text-white"
                        >
                          View Full Image
                        </a>
                      </div>
                      <img
                        src={selectedComplaint.imageUrl}
                        alt="Complaint evidence"
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 sm:h-64 bg-gray-100 rounded-lg text-gray-500 gap-2">
                      <ImageIcon className="w-10 h-10" />
                      <p>No image provided</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Stacked on mobile */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-10">
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                {selectedComplaint.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm sm:btn-md sm:btn-wide"
                      onClick={() =>
                        handleStatusUpdate(selectedComplaint._id, "resolve")
                      }
                      disabled={statusUpdateLoading !== null}
                    >
                      {statusUpdateLoading === "resolve" ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          <span className="hidden sm:inline">
                            Processing...
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Mark as Resolved
                          </span>
                          <span className="sm:hidden">Resolve</span>
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-error btn-sm sm:btn-md sm:btn-wide"
                      onClick={() =>
                        handleStatusUpdate(selectedComplaint._id, "reject")
                      }
                      disabled={statusUpdateLoading !== null}
                    >
                      {statusUpdateLoading === "reject" ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          <span className="hidden sm:inline">
                            Processing...
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Reject Complaint
                          </span>
                          <span className="sm:hidden">Reject</span>
                        </>
                      )}
                    </button>
                  </>
                )}
                <button
                  className="btn btn-ghost btn-sm sm:btn-md"
                  onClick={() => setSelectedComplaint(null)}
                  disabled={statusUpdateLoading !== null}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

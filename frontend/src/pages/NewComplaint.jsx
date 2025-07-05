import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../utils/axiosInstance.js";
import {
  AlertCircle,
  Upload,
  ImagePlus,
  MapPin,
  AlertTriangle,
  Lock,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const NewComplaint = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Low");
  const [location, setLocation] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Your existing handleSubmit function remains exactly the same
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("urgency", urgency);
    formData.append("location", location);
    formData.append("anonymous", anonymous);
    if (image) formData.append("image", image);

    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const res = await api.post("/complaints", formData, {
        //const res nikaala h
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Complaint submitted successfully");
      navigate("/citizen/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => navigate("/citizen/dashboard")}
            >
              <img
                src="https://play-lh.googleusercontent.com/x_TXE59qydJC4iR-u3BLlSoaWjJC65sjo7Kk8a_cwR2M-Pqq-p5hou-VF5CTvNl0BzoN"
                alt="Municipal Corporation Logo"
                className="h-10 mr-3 transition-transform group-hover:scale-105"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  City Services
                </h1>
                <p className="text-xs text-gray-500">
                  Citizen Complaint Portal
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/citizen/dashboard")}
              className="btn btn-ghost flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Decorative header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 w-full"></div>

          <div className="p-8">
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  New Complaint
                </h2>
                <p className="text-gray-500 mt-1">
                  Your voice matters — report issues in your area
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-blue-600" />
                    Complaint Title*
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Briefly describe the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Description Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Detailed Description*
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-40 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  placeholder="Provide complete details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Urgency Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">
                      Urgency Level*
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                {/* Location Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Location*
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Nearest landmark"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Anonymous Checkbox */}
              <div className="form-control">
                <label className="cursor-pointer label justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className="label-text text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Submit anonymously
                  </span>
                </label>
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4 text-blue-600" />
                    Upload Evidence (Optional)
                  </span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      {image ? image.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {image
                        ? `${Math.round(image.size / 1024)} KB`
                        : "JPG, PNG up to 5MB"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary w-full py-3 text-lg rounded-lg ${
                    isLoading ? "btn-disabled" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Complaint"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src="https://play-lh.googleusercontent.com/x_TXE59qydJC4iR-u3BLlSoaWjJC65sjo7Kk8a_cwR2M-Pqq-p5hou-VF5CTvNl0BzoN"
                alt="Municipal Logo"
                className="h-8 mr-3"
              />
              <span className="text-gray-600">
                Municipal Services Department
              </span>
            </div>
            <div className="text-sm text-gray-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} City Government</p>
              <p className="mt-1">24/7 Emergency: 1800-XXX-XXXX</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewComplaint;

import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="navbar bg-white border-b border-gray-200 px-6 shadow-sm z-50">
      <div className="flex-1 flex items-center gap-3">
        <img
          src="https://play-lh.googleusercontent.com/x_TXE59qydJC4iR-u3BLlSoaWjJC65sjo7Kk8a_cwR2M-Pqq-p5hou-VF5CTvNl0BzoN"
          alt="Municipal Logo"
          className="h-10 w-10 object-contain"
        />
        <div>
          <span className="text-lg font-semibold text-gray-800">
            Municipal Corporation
          </span>
          <span className="block text-sm text-gray-500">Admin Panel</span>
        </div>
      </div>

      <div className="flex-none gap-4">
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;

import { useNavigate } from "react-router";
import { Mail, LogIn, UserPlus } from "lucide-react";

const NavbarHome = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-50">
      <div className="flex-1">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="https://play-lh.googleusercontent.com/x_TXE59qydJC4iR-u3BLlSoaWjJC65sjo7Kk8a_cwR2M-Pqq-p5hou-VF5CTvNl0BzoN"
            alt="Municipal Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="font-semibold text-gray-800 hidden sm:inline text-sm">
            Municipal Corporation
          </span>
        </div>
      </div>
      <div className="flex-none gap-3">
        <button
          onClick={() => navigate("/contact")}
          className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Contact Us
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden md:inline">Login</span>
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden md:inline">Register</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarHome;

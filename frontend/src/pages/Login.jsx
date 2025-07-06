import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom"; // ✅ FIXED import
import toast from "react-hot-toast";
import api from "../utils/axiosInstance.js";
import { Lock, Mail, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login successful!");

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/citizen/dashboard");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="card w-full max-w-md bg-white shadow-xl">
        <div className="card-body p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWyELeC-GcbNeC4OGWqZxmk0NJwYonRLO81A&s"
              alt="Municipal Logo"
              className="w-20 h-20 object-contain mb-4"
            />
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Municipal Complaint System
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              Log in to submit and track complaints
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input input-bordered w-full pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Error Message with Resend Link */}
            {error && (
              <div className="text-sm text-red-500">
                {error.toLowerCase().includes("verify your email") ? (
                  <p>
                    Please verify your email.{" "}
                    <Link
                      to="/resend-verification"
                      className="underline text-blue-600"
                    >
                      Resend verification link
                    </Link>
                  </p>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            )}

            {/* Login Button */}
            <div className="form-control mt-6">
              <button
                className={`btn btn-primary w-full ${
                  isLoading ? "btn-disabled" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="loading loading-spinner"></span>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Login
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider & Register */}
          <div className="divider my-6">OR</div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="link link-primary">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

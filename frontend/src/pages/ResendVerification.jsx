import { useState } from "react";
import api from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { Mail, Send } from "lucide-react";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await api.post("/auth/resend-verification", { email });
      toast.success("Verification email resent. Please check your inbox!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="card w-full max-w-md bg-white shadow-xl">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Resend Verification Email
          </h2>

          <form onSubmit={handleResend} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter your email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSending}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSending}
            >
              {isSending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner"></span>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Resend Email
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;

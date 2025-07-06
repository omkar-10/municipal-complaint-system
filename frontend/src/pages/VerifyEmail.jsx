import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import api from "../utils/axiosInstance";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        if (res.data.message === "Email verified successfully") {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(
          "❌ Verification failed:",
          err.response?.data || err.message
        );
        setStatus("error");
      }
    };

    verifyToken();
  }, [searchParams]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              Verifying your email…
            </h2>
            <p className="text-gray-500 text-sm">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-700 mb-1">
              Email Verified!
            </h2>
            <p className="text-gray-600 text-sm">
              You will be redirected to login shortly…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-1">
              Invalid or Expired Link
            </h2>
            <p className="text-gray-600 text-sm">
              Please try registering again or contact support.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

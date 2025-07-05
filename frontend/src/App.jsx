import { Routes, Route, Navigate, useNavigate } from "react-router";
import HeroSection from "./pages/HeroSection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HeroSection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected Routes */}
      <Route
        path="/citizen/dashboard"
        element={
          <PrivateRoute>
            <CitizenDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/citizen/complaints/new" element={<NewComplaint />} />
      <Route path="/citizen/complaints/:id" element={<ComplaintDetail />} />

      {/* Catch-all for invalid routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

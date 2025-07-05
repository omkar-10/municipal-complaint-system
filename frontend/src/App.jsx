import { Routes, Route } from "react-router";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetail from "./pages/ComplaintDetail";
import { Navigate } from "react-router";
import PrivateRoute from "./components/PrivateRoute";
import HeroSection from "./pages/HeroSection";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          localStorage.getItem("userInfo") ? (
            <Navigate to="/citizen/dashboard" />
          ) : (
            <HeroSection />
          )
        }
      />

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
      <Route path="/" element={<HeroSection />} />
    </Routes>
  );
}

export default App;

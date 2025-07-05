// components/PrivateRoute.jsx
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

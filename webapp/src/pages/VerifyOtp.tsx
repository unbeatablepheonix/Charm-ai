import { Navigate } from "react-router-dom";

// OTP login has been replaced with email+password. Redirect anyone hitting this route.
export default function VerifyOtp() {
  return <Navigate to="/login" replace />;
}

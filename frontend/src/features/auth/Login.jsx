import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginPhoto from "../../assets/loginphoto.jpg";
import authService from "./authService";
import { extractApiError } from "../../shared/services/apiHelpers";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email (e.g., user@gmail.com)";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    // ✅ Validate before submitting
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await authService.login({ email, password });
      navigate('/');
    } catch (err) {
      const apiErr = extractApiError(err, "Invalid email or password");
      setError(apiErr.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen overflow-hidden font-sans bg-[rgb(var(--velore-canvas))]">
      {/* LEFT IMAGE */}
      <div className="relative w-full h-64 md:h-full md:w-[45%] overflow-hidden">
        <img
          src={loginPhoto}
          alt="Fashion model with sunglasses"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/30" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white md:hidden" />
        <div className="hidden md:block absolute inset-y-0 right-0 w-40 bg-gradient-to-r from-transparent to-white" />
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 md:px-12 bg-[rgb(var(--velore-canvas))] overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="v-card-luxury p-6 md:p-7">
          <h1 className="v-title mb-2">Welcome back</h1>
          <p className="v-muted mb-8">Sign in to continue your shopping experience.</p>

          {/* General Error Message */}
          {error && (
            <div className="v-banner-error mb-4">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-black mb-1.5 tracking-wide">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors({ ...fieldErrors, email: '' });
              }}
              className={`v-input ${fieldErrors.email ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p className="v-field-error">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1.5 tracking-wide">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors({ ...fieldErrors, password: '' });
              }}
              className={`v-input ${fieldErrors.password ? '!border-red-500 focus:!border-red-500 focus:!ring-red-500/10' : ''}`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="v-field-error">{fieldErrors.password}</p>
            )}
            <Link
              to="/forgot-password"
              className="inline-block mt-2 text-xs text-gray-500 underline hover:text-gray-900 transition"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full v-btn-primary !py-3"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            New Customer?{" "}
            <Link
              to="/signup"
              className="text-gray-900 font-medium underline hover:text-gray-700"
            >
              Create My Account
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
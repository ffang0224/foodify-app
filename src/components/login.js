import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UtensilsCrossed,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let loginEmail = formData.emailOrUsername;

      if (!loginEmail.includes("@")) {
        const userResponse = await fetch(
          `https://foodify-backend-927138020046.us-central1.run.app/users/${formData.emailOrUsername}`
        );

        if (!userResponse.ok) {
          throw new Error("Invalid username or password");
        }

        const userData = await userResponse.json();
        loginEmail = userData.email;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        formData.password
      );

      const response = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/auth/${userCredential.user.uid}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();

      localStorage.setItem("userData", JSON.stringify(userData));

      navigate("/map");
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "Invalid email/username or password"
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Left side - Image section - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 dark:bg-gray-800 items-center justify-center">
        <img
          src="/app_image.jpg"
          alt="App Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-800">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <UtensilsCrossed className="w-16 h-16 sm:w-24 sm:h-24 text-orange-500" />
          </div>

          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Log in to Foodify
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 sm:p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md shadow-sm border border-green-300 dark:border-green-800 text-sm sm:text-base">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md shadow-sm border border-red-300 dark:border-red-800 flex items-center text-sm sm:text-base">
              <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email or Username
              </label>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-orange-500 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  Sign up
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

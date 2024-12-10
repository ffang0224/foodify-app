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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Image section */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center h-screen">
        <img
          src="/app_image.jpg"
          alt="App Image"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <UtensilsCrossed className="w-24 h-24 text-orange-500" />
          </div>

          <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">
            Log in to Foodify
          </h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md shadow-sm border border-green-300">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md shadow-sm border border-red-300">
              <AlertCircle className="inline-block w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-sm font-medium text-gray-700"
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
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
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
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
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
              <span className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-orange-500 hover:text-orange-600 font-semibold"
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

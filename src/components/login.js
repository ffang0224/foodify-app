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
      // Determine if input is email or username
      let loginEmail = formData.emailOrUsername;

      // If it's not an email, fetch the email from the backend
      if (!loginEmail.includes("@")) {
        const userResponse = await fetch(
          `http://localhost:8000/users/${formData.emailOrUsername}`
        );

        if (!userResponse.ok) {
          throw new Error("Invalid username or password");
        }

        const userData = await userResponse.json();
        loginEmail = userData.email;
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        formData.password
      );

      // Fetch user data from backend
      const response = await fetch(
        `http://localhost:8000/users/auth/${userCredential.user.uid}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();

      // Store user data in localStorage if needed
      localStorage.setItem("userData", JSON.stringify(userData));

      // Navigate to home page
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
    <div className="flex min-h-screen">
      {/* Left side - Image section */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center h-screen">
        <img
          src="/app_image.jpg"
          alt="App Image"
          className="w-full h-screen max-h-screen overflow-hidden rounded-lg flex items-center justify-center"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mx-auto flex items-center text-center justify-center">
            <UtensilsCrossed className="w-32 h-32 text-orange-500" />
          </div>

          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
            Log in to Foodify
          </h2>

          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              className="w-full rounded-md bg-orange-500 py-2 px-3 text-sm font-semibold text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
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

            <div className="text-center">
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

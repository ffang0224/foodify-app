import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
} from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const navigate = useNavigate();

  // Check username availability
  const checkUsername = async () => {
    if (!formData.username || formData.username.length < 3) {
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await fetch(
        `https://foodify-backend-927138020046.us-central1.run.app/users/${formData.username}`
      );
      setUsernameAvailable(response.status === 404); // 404 means username is available
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(false);
    } finally {
      setCheckingUsername(false);
    }
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numeric: /[0-9]/.test(password),
    };

    if (!requirements.length)
      return "Password must be at least 8 characters long";
    if (!requirements.uppercase)
      return "Password must contain an uppercase letter";
    if (!requirements.lowercase)
      return "Password must contain a lowercase letter";
    if (!requirements.numeric) return "Password must contain a number";

    return null;
  };

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
      // Check username availability one last time
      if (!usernameAvailable) {
        throw new Error("Username is not available");
      }

      // Validate passwords
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        throw new Error(passwordError);
      }

      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Prepare user data for API
      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        uid: userCredential.user.uid,
        points: {
          generalPoints: 0,
          postPoints: 0,
          reviewPoints: 0,
        },
        playlists: [],
        emailVerified: false,
        achievements: [],
      };

      // Create user in backend
      const response = await fetch(
        "https://foodify-backend-927138020046.us-central1.run.app/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // If backend creation fails, delete the Firebase auth user
        await userCredential.user.delete();
        throw new Error(data.detail || "Failed to create user profile");
      }

      // Sign out after successful registration
      await auth.signOut();

      // Navigate to login with success message
      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in.",
        },
      });
    } catch (err) {
      setError(err.message);
      // Clean up: If there was an error and auth user was created, delete it
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Left side - Image section */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 dark:bg-gray-800 items-center justify-center">
        <img
          src="/app_image.jpg"
          alt="App Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-800">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <UtensilsCrossed className="w-20 h-20 sm:w-32 sm:h-32 text-orange-500" />
          </div>

          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign up for Foodify
          </h2>

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Username field with availability check */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md px-3 py-2 bg-white dark:bg-gray-700 focus:ring-orange-500 ${
                    usernameAvailable === null
                      ? "border-gray-300 dark:border-gray-600"
                      : usernameAvailable
                      ? "border-green-500 dark:border-green-600"
                      : "border-red-500 dark:border-red-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={checkUsername}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  Check
                </button>
              </div>

              {checkingUsername && (
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Checking availability...
                </div>
              )}
              {!checkingUsername && usernameAvailable !== null && (
                <div className={`mt-1 text-sm ${
                  usernameAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {usernameAvailable ? "Username is available" : "Username is taken"}
                </div>
              )}
            </div>

            {/* Name fields - Stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="w-full sm:w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Password fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-orange-500 focus:border-orange-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || checkingUsername || usernameAvailable === false}
              className="w-full rounded-md bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  Log in
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

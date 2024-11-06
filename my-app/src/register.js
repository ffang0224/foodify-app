import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Register component
const Register = () => {
  // State for input fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Nevigation after registration
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = (e) => {
    // Doesn't reload after submission
    e.preventDefault();
    // Navigate to the login page after successful registration
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image section */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
        <div className="w-3/4 h-3/4 bg-gray-300 rounded-lg flex items-center justify-center font-bold text-gray-600">
          App Image
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-200 flex items-center text-center justify-center text-sm font-bold text-gray-600">
            Logo Image
          </div>

          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign up for Foodify
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-black py-2 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Register
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center px-3 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/18/Gile_use.png?20230327030750"
                alt="Google logo"
                className="h-6 w-6 mr-3"
              />
              <span className="text-gray-700 font-semibold">
                Continue with Google
              </span>
            </button>

            <button className="w-full flex items-center justify-center px-3 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook logo"
                className="h-6 w-6 mr-3"
              />
              <span className="text-gray-700 font-semibold">
                Continue with Facebook
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

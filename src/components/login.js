import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

// Disclaimer: This component has been partially generated using Claude.
// Login component
const Login = () => {
  // State for input fields
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  // Navigation after login
  const navigate = useNavigate();

  // Form submission handler
  const handleSubmit = (e) => {
    // Doesn't reload after submission
    e.preventDefault();
    // Navigate to the map page after successful login
    navigate("/map");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image section */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center h-screen">
        <img
          src="/app_image.png"
          alt="App Image"
          className="w-full h-full object-fill max-w-[80%] max-h-[80%] rounded-lg"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mx-auto flex items-center text-center justify-center">
            {/* Logo Image */}
            <UtensilsCrossed className="w-32 h-32 text-orange-500" />
          </div>

          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
            Log in to Foodify
          </h2>

          {/* Social Login Buttons */}
          <div className="mt-6 space-y-4">
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
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
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
                <a
                  href="#"
                  className="text-sm font-semibold text-gray-600 hover:text-black"
                >
                  Forgot password?
                </a>
              </div>
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
              Log in
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/register"
              className="font-semibold text-gray-600 hover:text-black"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

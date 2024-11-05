import React, { useState } from "react";
import "./App.css";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in with Email or Username: ${emailOrUsername}`);
  };

  return (
    <div className="login-container">
      {/* Left side - Image section */}
      <div className="login-image-section">
        <div className="login-image-placeholder">App Image</div>
      </div>

      {/* Right side - Login form */}
      <div className="login-form-section">
        <div className="w-full max-w-md">
          <div className="login-logo-placeholder">Logo Image</div>
          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-black">
            Log in to Foodify
          </h2>

          {/* Social Login Buttons */}
          <div className="mt-6 space-y-4">
            <button className="social-login-button">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/1/18/Gile_use.png?20230327030750"
                alt="Google logo"
                className="social-login-icon"
              />
              <span>Continue with Google</span>
            </button>

            <button className="social-login-button">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook logo"
                className="social-login-icon"
              />
              <span>Continue with Facebook</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="emailOrUsername"
                className="block text-sm font-medium text-gray-900 text-left"
              >
                Email or Username
              </label>
              <div className="mt-2">
                <input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 text-left"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-gray-600 hover:text-black"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Log in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
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

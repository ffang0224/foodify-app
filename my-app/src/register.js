import React, { useState } from "react";
import "./App.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registering with Email: ${email}, Username: ${username}`);
  };

  return (
    <div className="login-container">
      {/* Left side - Image section */}
      <div className="login-image-section">
        <div className="login-image-placeholder">App Image</div>
      </div>

      {/* Right side - Register form */}
      <div className="login-form-section">
        <div className="w-full max-w-md">
          <div className="login-logo-placeholder">Logo Image</div>
          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-black">
            Sign up for Foodify
          </h2>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 text-left"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 text-left"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 text-left"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Register
              </button>
            </div>
          </form>

          {/* Divider with "or" */}
          <div className="flex items-center my-6">
            <hr className="w-full border-gray-300" />
            <span className="px-4 text-gray-500">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default Register;

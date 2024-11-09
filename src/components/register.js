import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image section */}
      <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center">
        <div className="w-3/4 h-3/4 bg-gray-300 rounded-lg flex items-center justify-center">
          <img
            src="https://img.freepik.com/premium-photo/close-up-pancake-berries-with-dripping-honey-fork-white-background-food-dessert-fun-copy-space-concept_13339-316062.jpg?w=1060"
            alt="App Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mx-auto flex items-center text-center justify-center">
            <UtensilsCrossed className="w-32 h-32 text-orange-500" />
          </div>

          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign up for Foodify
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field */}
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

            {/* First and Last Name Fields */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
                />
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            {/* Username Field */}
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

            {/* Password Field */}
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-black py-2 px-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

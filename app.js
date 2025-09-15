import React, { useState, useEffect } from "react";
import { Mail, Lock, User, LogOut, Home, Shield } from "lucide-react";

const LoginApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  // Check if user is already logged in (on component mount)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!name) {
        newErrors.name = "Name is required";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        const authToken = Math.random().toString(36).substring(2);
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("currentUser ", JSON.stringify(user));
        setIsAuthenticated(true);
        setErrors({});
      } else {
        setErrors({ general: "Invalid email or password" });
      }
    } else {
      // Register logic
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      if (users.some((user) => user.email === email)) {
        setErrors({ general: "User  with this email already exists" });
        return;
      }

      const newUser  = { name, email, password };
      users.push(newUser );
      localStorage.setItem("users", JSON.stringify(users));

      // Auto-login after registration
      const authToken = Math.random().toString(36).substring(2);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("currentUser ", JSON.stringify(newUser ));
      setIsAuthenticated(true);
      setErrors({});
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser ");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  if (isAuthenticated) {
    const currentUser  = JSON.parse(localStorage.getItem("currentUser ") || "{}");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Welcome to Secure Area
          </h1>

          <p className="text-center text-gray-600 mb-8">
            You have successfully logged in to your account.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold text-gray-700 mb-2">User  Information</h2>
            <p className="text-gray-600">
              <span className="font-medium">Name:</span> {currentUser .name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {currentUser .email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Home className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-center text-gray-600 mb-8">
          {isLogin ? "Sign in to continue" : "Join us today to get started"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your name"
                />
              </div>
              {errors?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors?.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors?.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {errors?.general && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginApp;
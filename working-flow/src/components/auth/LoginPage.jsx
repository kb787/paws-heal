import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AuthLayout from "./AuthLayout";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        const timeLeft = Math.max(0, lockoutTime - Date.now());
        setRemainingTime(Math.ceil(timeLeft / 1000)); // Convert ms to seconds

        if (timeLeft <= 0) {
          clearInterval(timer);
          setLockoutTime(null); // Reset lockout time once the timer expires
        }
      }, 1000);

      return () => clearInterval(timer); // Cleanup on component unmount
    }
  }, [lockoutTime]); // Only run the effect if lockoutTime changes

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending login request...");
      const response = await axios.post("http://localhost:3500/signin", {
        email: email,
        password: password,
      });
      console.log("Backend response", response);
      console.log("Response received:", response.data);
      localStorage.setItem("userId", response.data.existingUser._id);
      localStorage.setItem("accessToken", response.data.token);
      if (response.data.success) {
        toast.success("Login successful!");
        navigate("/welcome");
      }
    } catch (err) {
      console.log("Error:", err);
      if (err.response) {
        // Check if a response is present (to avoid accessing undefined properties)
        const errorData = err.response.data;

        if (err.response.status === 401) {
          // Handle invalid credentials error
          setError(errorData?.error || "Invalid credentials"); // Provide fallback message
        } else if (err.response.status === 429) {
          // Handle rate-limiting error
          toast.error("Too many failed attempts. Try again later.");
          // Start a 10-minute timer (600,000 ms)
          setLockoutTime(Date.now() + 1 * 60 * 1000);
        } else {
          // Handle other errors
          setError(errorData?.error || "An error occurred during login.");
          toast.error(errorData?.error || "An error occurred during Login");
        }
      } else {
        // If no response is available, handle the case (for example, network error)
        setError(
          "An error occurred. Please check your connection or try again later."
        );
        toast.error(
          "An error occurred. Please check your connection or try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="w-full max-w-lg p-8">
          <h2 className="text-4xl font-bold text-white mb-6 text-center bg-gradient-to-r from-white to-gray-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email Address
              </label>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!lockoutTime}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!!lockoutTime}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex items-center mb-6">
              <Link
                to="/forgot-password"
                className={`text-sm ${
                  lockoutTime
                    ? "text-gray-400 pointer-events-none"
                    : "text-purple-400 hover:underline"
                }`}
                style={{ pointerEvents: lockoutTime ? "none" : "auto" }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Messages */}
            {error && (
              <p className="text-red-500 font-semibold mb-2">{error}</p>
            )}

            {lockoutTime && (
              <p className="text-red-500 font-semibold mb-2">
                Too many failed attempts. Try again in {remainingTime} seconds.
              </p>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: lockoutTime ? 1 : 1.02 }}
              whileTap={{ scale: lockoutTime ? 1 : 0.98 }}
              className={`w-full py-3 px-4 bg-gradient-to-r ${
                lockoutTime
                  ? "from-gray-500 to-gray-600 cursor-not-allowed"
                  : "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              } text-white font-bold rounded-lg shadow-lg transition duration-200`}
              type="submit"
              disabled={!!lockoutTime || isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Login"
              )}
            </motion.button>
          </form>
        </div>

        {/* Bottom Section with Signup */}
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
};
export default LoginPage;

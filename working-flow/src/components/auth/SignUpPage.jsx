import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from './Input';
import { Loader, Lock, Mail, User, Clipboard} from "lucide-react";
import AuthLayout from './AuthLayout';


const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organizationId, setOrganizationId]=useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            console.log("Sending signup request...");
            const response = await axios.post("http://localhost:3500/signup", {
                email:email,
                password:password,
                username:name,
                organizationId:organizationId,
            });
            console.log("Response received:", response);
            console.log(response.data.message);
            localStorage.setItem("userId",response.data.newUser._id) ;
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "An error occurred during signup");
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
            <div className="p-0">
               <h1 className="text-4xl font-bold text-white mb-6 text-center">Create Account</h1>
        
              <form onSubmit={handleSignUp}>
                {/* Full Name Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <Input
                    icon={User}
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
    
                {/* Email Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                  <Input
                    type="email"
                    icon={Mail}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
    
                {/* Password Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                  <Input
                    type="password"
                    icon={Lock}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
    
                {/* Organization ID Input */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Organization ID</label>
                  <Input
                    type="text"
                    icon={Clipboard}
                    placeholder="Organization ID"
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
    
                {/* Error Message */}
                {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
    
                {/* Submit Button */}
                <motion.button
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin mx-auto w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    "Sign Up"
                  )}
                </motion.button>
              </form>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-400 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </motion.div>
        </AuthLayout>
      );
    };


export default SignUpPage;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { PulseLoader } from 'react-spinners';

const LoginPage = () => {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added state for loader

  useEffect(() => {
    // if (user) {
    //   navigate('/');
    // }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCredentials({ ...credentials, [name]: value });

    // Validate fields
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: emailRegex.test(value) ? '' : 'Invalid email format.',
      }));
    }

    if (name === 'password') {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: passwordRegex.test(value)
          ? ''
          : 'Password must be at least 8 characters long, contain one uppercase, one lowercase, and one number.',
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    // Simulate loading for 2-3 seconds
    setTimeout(() => {
      handleUserLogin(e, credentials); // Handle user login
      setLoading(false); // Hide loader

      if (user) {
        navigate('/');
    } // Redirect to home page
    }, 3000);
    setCredentials({email:'', password:''})
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl text-white font-semibold text-center mb-6">Login</h1>

        {loading ? (
          <div className="flex justify-center py-6">
            <PulseLoader color="#00dcff" size={12} />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">Email:</label>
              <div
                className={`flex items-center rounded-lg px-4 py-2 ${
                  errors.email ? 'bg-red-500' : 'bg-gray-700'
                }`}
              >
                <FaEnvelope className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  value={credentials.email}
                  onChange={handleInputChange}
                  className={`bg-transparent text-white focus:outline-none w-full ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
              </div>
              <p
                className={`text-xs mt-2 ${
                  errors.email ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {errors.email || 'Must be a valid email address (e.g., example@domain.com).'}
              </p>
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <label className="block text-gray-300 font-semibold mb-2">Password:</label>
              <div
                className={`flex items-center rounded-lg px-4 py-2 ${
                  errors.password ? 'bg-red-500' : 'bg-gray-700'
                }`}
              >
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password..."
                  value={credentials.password}
                  onChange={handleInputChange}
                  className={`bg-transparent text-white focus:outline-none w-full ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                {/* Eye Icon */}
                <div className="cursor-pointer ml-2 text-gray-400">
                  {showPassword ? (
                    <FaEyeSlash onClick={togglePasswordVisibility} />
                  ) : (
                    <FaEye onClick={togglePasswordVisibility} />
                  )}
                </div>
              </div>
              <p
                className={`text-xs mt-2 ${
                  errors.password ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {errors.password ||
                  'Must be at least 8 characters, including one uppercase, one lowercase, and one number.'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={errors.email || errors.password || loading}
              className={`w-full text-white font-semibold rounded-lg px-4 py-3 transition ${
                errors.email || errors.password || loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Login
            </button>

            {/* Signup Link */}
            <div className="mt-4 text-center">
              <span className="text-gray-400">
                Don't have an account?{' '}
                <span
                  className="text-blue-400 font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate('/register')}
                >
                  Register
                </span>
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

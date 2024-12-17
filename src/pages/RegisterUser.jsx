import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RegisterUser = () => {
  const { handleUserRegister } = useAuth();

  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 800);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCredentials({ ...credentials, [name]: value });

    if (name === 'email') {
      setErrors({
        ...errors,
        email: emailRegex.test(value) ? '' : 'Invalid email format.',
      });
    }
    if (name === 'password') {
      setErrors({
        ...errors,
        password: passwordRegex.test(value)
          ? ''
          : 'Password must have at least 8 characters, uppercase, lowercase, and a number.',
      });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!errors.email && !errors.password) {
     handleUserRegister(e, credentials);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl text-white font-semibold text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">Name:</label>
            <div className="flex items-center px-4 py-2 bg-gray-700 rounded-lg">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={credentials.name}
                onChange={handleInputChange}
                className="bg-transparent text-white focus:outline-none w-full"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2">Email:</label>
            <div className="flex items-center px-4 py-2 bg-gray-700 rounded-lg">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange}
                className="bg-transparent text-white focus:outline-none w-full"
                required
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            <p className="text-gray-400 text-xs mt-1">example@example.com</p>
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-gray-300 font-semibold mb-2">Password:</label>
            <div className="flex items-center px-4 py-2 bg-gray-700 rounded-lg">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                className="bg-transparent text-white focus:outline-none w-full"
                required
              />
              {!isMobileView && (
                <div
                  className="cursor-pointer ml-2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              )}
            </div>

            {/* Show Password Text */}
            {isMobileView && (
              <div className="text-blue-400 text-xs text-right cursor-pointer mt-1">
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </span>
              </div>
            )}

            <p className="text-gray-400 text-xs mt-1">
              Password must have at least 8 characters, uppercase, lowercase, and a number.
            </p>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6 relative">
            <label className="block text-gray-300 font-semibold mb-2">Confirm Password:</label>
            <div className="flex items-center px-4 py-2 bg-gray-700 rounded-lg">
              <FaKey className="text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={credentials.confirmPassword}
                onChange={handleInputChange}
                className="bg-transparent text-white focus:outline-none w-full"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => credentials.password === credentials.confirmPassword ?  navigate('/login'): ''}
            type="submit"
            className="w-full text-white font-semibold rounded-lg px-4 py-3 bg-blue-500 hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <span className="text-gray-400">Already have an account? </span>
          <span
            className="text-blue-400 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;

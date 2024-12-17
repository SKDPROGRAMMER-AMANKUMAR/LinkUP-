import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { IoIosLogOut } from 'react-icons/io';

const Header = () => {
  const { user , handleUserLogout} = useAuth();

  return (
    <header className="bg-gray-900 text-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="text-xl font-bold">
        {/* Logo or Title */}
        <span className="text-blue-500">LinkUP</span>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* Welcome Message */}
            <span className="text-sm font-medium">
              Welcome, <span className="text-blue-400">{user.name}</span>
            </span>

            {/* Logout Icon */}
            <button
              className="text-white hover:text-red-500 transition-colors duration-300"
              title="Logout"
            >
              <IoIosLogOut onClick={handleUserLogout} size={24} />
            </button>
          </>
        ) : (
          /* Login Button */
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300">
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;

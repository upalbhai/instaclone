import axios from "axios";
import { Avatar } from "flowbite-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  HiHeart,
  HiHome,
  HiLogout,
  HiMailOpen,
  HiPlusSm,
  HiSearch,
  HiTrendingUp,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_SERVER_URL;

const LeftSidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user/logout`,
        { withCredentials: true }
      );
      toast.success('logout successfully');
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sideBarHandler = (textType) => {
    if (textType === "Logout") {
      return logoutHandler();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sideBarItems = [
    {
      icon: <HiHome className="text-2xl" />,
      text: "Home",
    },
    {
      icon: <HiSearch className="text-2xl" />,
      text: "Search",
    },
    {
      icon: <HiTrendingUp className="text-2xl" />,
      text: "Trending",
    },
    {
      icon: <HiMailOpen className="text-2xl" />,
      text: "Messages",
    },
    {
      icon: <HiHeart className="text-2xl" />,
      text: "Notifications",
    },
    {
      icon: <HiPlusSm className="text-2xl" />,
      text: "Create",
    },
    {
      icon: (
        <Avatar img="" rounded bordered className="w-4 h-4" />
      ),
      text: "Profile",
    },
    {
      icon: <HiLogout className="text-2xl" />,
      text: "Logout",
    },
  ];

  return (
    <div className="fixed w-60">
      {/* Sidebar for larger screens */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden sm:block h-screen w-full bg-black p-4 border-r shadow-md"
      >
        <div className="flex flex-col space-y-3">
          {sideBarItems.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => sideBarHandler(item.text)}
              className="flex items-center py-3 cursor-pointer px-4 rounded-lg transition-colors"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} // Correct hover effect
              transition={{ duration: 0.2 }}
            >
              <div className="mr-3 flex justify-center text-white items-center text-xl">
                {item.icon}
              </div>
              <span className="text-gray-100 font-medium">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Navbar for smaller screens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 shadow-md"
      >
        <div className="flex justify-around">
          {sideBarItems.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              onClick={() => sideBarHandler(item.text)}
              className="flex flex-col items-center cursor-pointer transition-colors p-2 rounded-lg"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.1)' }} // Correct hover effect
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl text-gray-700">{item.icon}</div>
              <span className="text-xs text-gray-700">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Toggle button for sidebar on mobile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden fixed bottom-16 right-4"
      >
        <button
          onClick={toggleSidebar}
          className="p-3 rounded-full bg-blue-500 text-white shadow-lg"
        >
          <HiPlusSm className="text-2xl" />
        </button>
      </motion.div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={toggleSidebar}
        >
          <div className="h-screen w-64 bg-black p-4 border-r shadow-md fixed top-0 left-0 z-50">
            <div className="flex flex-col space-y-3">
              {sideBarItems.map((item, index) => (
                <motion.div
                  key={index}
                  onClick={() => sideBarHandler(item.text)}
                  className="flex items-center py-3 cursor-pointer px-4 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }} // Correct hover effect
                  transition={{ duration: 0.2 }}
                >
                  <div className="mr-3 flex justify-center items-center text-xl text-gray-100">
                    {item.icon}
                  </div>
                  <span className="text-gray-100 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LeftSidebar;

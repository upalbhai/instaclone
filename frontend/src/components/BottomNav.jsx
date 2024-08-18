import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiHome, HiSearch, HiTrendingUp, HiMailOpen, HiHeart, HiPlusSm, HiLogout, HiUpload } from 'react-icons/hi';
import { Avatar } from 'flowbite-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_SERVER_URL;

const BottomNav = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: <HiHome />, text: 'Home' },
    { icon: <HiSearch />, text: 'Search' },
    { icon: <HiTrendingUp />, text: 'Trending' },
    { icon: <HiMailOpen />, text: 'Messages' },
    { icon: <HiHeart />, text: 'Notifications' },
    { icon: <HiUpload />, text: 'Upload' },
    {
      icon: <Avatar img="/images/people/profile-picture-5.jpg" rounded bordered className="w-8 h-8" />,
      text: 'Profile'
    },
    { icon: <HiLogout />, text: 'Logout' }
  ];

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  const logoutHandler = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user/logout`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setHandler = (textName) => {
    if (textName === 'Logout') {
      return logoutHandler();
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-200 p-3 shadow-lg z-50">
      <div className="flex justify-around items-center">
        {/* Main Nav Items */}
        {navItems.slice(0, 4).map((item, index) => (
          <motion.div
            key={index}
            className="text-center cursor-pointer p-3 rounded-full bg-transparent  shadow-sm transition-transform duration-300"
            whileHover={{ scale: 1.15 }}
          >
            <div className="text-2xl text-white">{item.icon}</div>
          </motion.div>
        ))}

        {/* Toggle Button for Additional Options */}
        <motion.div
          className="text-center cursor-pointer p-3 rounded-full bg-transparent shadow-sm transition-transform duration-300"
          onClick={togglePanel}
          whileHover={{ scale: 1.2 }}
        >
          <HiPlusSm className="text-3xl text-yellow-500" />
        </motion.div>
      </div>

      {/* Panel for Additional Options */}
      {isPanelOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-4 right-4 bg-transparent rounded-lg shadow-lg p-4 z-50"
        >
          <div className="grid grid-cols-4 bg-black gap-4 text-center">
            {navItems.slice(4).map((item, index) => (
              <motion.div
                key={index}
                className={`flex flex-col items-center justify-center  p-4 rounded-lg shadow-sm cursor-pointer transform transition-transform duration-300  ${
                  item.text === 'Logout' ? 'text-red-500' : 'text-gray-700'
                }`}
                whileHover={{ scale: 1.1 }}
                onClick={() => setHandler(item.text)}
              >
                <div className="text-2xl text-white mb-1">{item.icon}</div>
                <span className="text-sm text-white font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BottomNav;

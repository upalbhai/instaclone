import React, { useEffect, useState } from 'react';
import Posts from './Posts';
import axios from 'axios';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'; // Default value if undefined

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllPost = async () => {
    try {
      const url = `${apiUrl}/api/v1/post/all`;
      console.log("Request URL:", url);

      const response = await axios.get(url, { withCredentials: true });
      console.log("Response:", response);

      setPosts(response.data.message);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error('Failed to load posts. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <div className="bg-black min-h-screen p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-white text-lg">Loading posts...</div>
        </div>
      ) : posts.length > 0 ? (
        <Posts post={posts} />
      ) : (
        <div className="text-white text-center">
          No posts available. Be the first to share something!
        </div>
      )}
    </div>
  );
};

export default Feed;

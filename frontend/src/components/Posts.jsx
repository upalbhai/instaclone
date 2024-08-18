import { Card } from 'flowbite-react';
import React, { useState } from 'react';

const Posts = ({ post }) => {
  return (
    <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {post?.map((item, index) => (
        <PostCard key={index} item={item} />
      ))}
    </div>
  );
};

const PostCard = ({ item }) => {
  const [showComments, setShowComments] = useState(false);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="w-full bg-black rounded-lg shadow-md overflow-hidden">
      <Card className="w-full bg-black h-auto">
        {/* Post Image */}
        <img
          src={item.image}
          alt={item.caption}
          className="w-full h-64 object-cover"
        />
        {/* Author Section */}
        <div className="flex bg-black items-center p-4">
          <img
            src={item?.author?.profilePicture}
            alt="Author"
            className="w-10 h-10 rounded-full mr-3"
          />
          <p className="text-lg font-bold text-gray-100">
            @{item?.author?.username}
          </p>
        </div>
        {/* Caption */}
        <p className="px-4 text-gray-100">{item?.caption}</p>

        {/* Like and Comment Counters */}
        <div className="px-4 py-2 flex justify-between text-gray-100">
          <span>{item.likes} Likes</span>
          <span>{item.comments.length} Comments</span>
        </div>

        {/* Toggle Comments Button */}
        <div className="px-4 py-2">
          <button
            onClick={handleToggleComments}
            className="text-sm text-blue-100"
          >
            {showComments ? 'Hide Comments' : 'View Comments'}
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="px-4 py-2">
            {item.comments.length === 0 ? (
              <p className="text-sm text-gray-100">
                No comments yet. Start the conversation!
              </p>
            ) : (
              item.comments.slice(0, 5).map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 mb-2">
                  <img
                    src={comment?.author?.profilePicture}
                    alt="Comment Author"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-100">
                      {comment?.author?.username}
                    </p>
                    <p className="text-sm text-gray-100">{comment?.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Posts;

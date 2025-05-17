import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiArrowLeft } from 'react-icons/fi';

const PostsAndComments = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First fetch all posts
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const allPosts = await response.json();
        
        // Filter based on user type
        if (session?.user?.isAdmin) {
          // Admin sees all posts
          setPosts(allPosts);
        } else {
          // Regular users see only their posts
          // Convert userId to number if it's stored as string
          const userId = parseInt(session?.user?.id);
          setPosts(allPosts.filter(post => post.userId === userId));
        }
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPosts();
    }
  }, [session]); // Re-fetch when session changes

  const fetchComments = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Failed to fetch comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    // Verify the user has access to this post
    if (!session?.user?.isAdmin && post.userId !== parseInt(session?.user?.id)) {
      setError('You do not have permission to view this post');
      return;
    }
    
    setSelectedPost(post);
    fetchComments(post.id);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setComments([]);
    setError(null);
  };

  return (
    <div className="flex-1 min-w-0 border-x border-gray-200 bg-white"> 
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">
            {selectedPost ? 'Post Details' : 
             session?.user?.isAdmin ? 'All Posts' : 'Your Posts'}
          </h2>
          {session?.user?.isAdmin && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              ADMIN VIEW
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {!selectedPost ? (
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map(post => (
                    <div 
                      key={post.id} 
                      className="p-4 border border-gray-200 rounded-lg hover:bg-yellow-200 cursor-pointer transition-colors bg-white" 
                      onClick={() => handlePostClick(post)}
                    >
                      <h3 className="font-bold text-black">{post.title}</h3>
                      <p className="text-sm text-gray-600">
                        By User #{post.userId}
                        {session?.user?.isAdmin && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            User {post.userId}
                          </span>
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {session?.user?.isAdmin 
                      ? 'No posts found' 
                      : 'You have no posts yet'}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-black hover:text-gray-800 mb-4 transition-colors"
                >
                  <FiArrowLeft className="mr-1" />
                  Back to {session?.user?.isAdmin ? 'all posts' : 'your posts'}
                </button>
                
                <div className="bg-white p-6 rounded-lg shadow"> 
                  <h2 className="text-2xl font-bold mb-2 text-black">{selectedPost.title}</h2>
                  <p className="text-gray-800 mb-4">{selectedPost.body}</p>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-bold mb-3 text-black">Comments ({comments.length})</h3>
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comments.length > 0 ? (
                          comments.map(comment => (
                            <div 
                              key={comment.id} 
                              className="border-b pb-4 last:border-0 transition-all hover:bg-yellow-200 px-2 py-1 rounded bg-white" 
                            >
                              <h4 className="font-bold text-black">{comment.name}</h4>
                              <p className="text-gray-800">{comment.body}</p>
                              <p className="text-sm text-gray-600 mt-1">{comment.email}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No comments yet</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostsAndComments;
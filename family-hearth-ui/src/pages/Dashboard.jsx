import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { useAuth } from '../AuthContext';



import {
  getMyFamily,

  getPosts
} from '../authedApi';



import PostCard from '../components/PostCard';

function Dashboard() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (accessToken) {
      const fetchPosts = async () => {
        setPostsLoading(true);
        try {
          const familyResponse = await getMyFamily();
          const familyId = familyResponse.data.id;
          localStorage.setItem('familyId', familyId);
          const postsResponse = await getPosts(familyId);
          setPosts(postsResponse.data.posts);
        } catch (err) {
          setError('Failed to fetch posts.');
          console.error('Dashboard: Error fetching posts.', err);
        } finally {
          setPostsLoading(false);
        }
      };
      fetchPosts();
    } else {
      setPostsLoading(false);
    }
  }, [authLoading, accessToken]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p>Authenticating...</p>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8 max-w-[470px] mx-auto w-full">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Family Feed</h2>
            <p className="text-xs text-gray-500">Welcome, {user ? user.firstName : 'User'}</p>
          </div>
          <div className="flex space-x-2">
            <Link to="/invite" className="text-sm font-semibold text-blue-500 hover:text-blue-700">
              Invite
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex flex-col items-center">
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No posts yet. Be the first to share something!</p>
              <Link to="/create-post" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
                Create Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

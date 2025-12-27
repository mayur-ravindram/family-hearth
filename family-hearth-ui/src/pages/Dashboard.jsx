import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { getPosts, getMyFamily } from '../authedApi';

const PostCard = ({ post }) => (
  <div className="bg-white border border-gray-200 rounded-lg mb-6 w-full max-w-[470px] mx-auto shadow-sm">
    {/* Header */}
    <div className="flex items-center p-3 border-b border-gray-100">
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-[2px] mr-3">
        <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
           {post.authorName ? post.authorName.charAt(0) : 'U'}
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-900">{post.authorId}</p>
    </div>

    {/* Media */}
    {post.media && post.media.length > 0 && (
      <div className="w-full bg-black flex flex-col items-center">
        {post.media.map(mediaItem => (
          <img 
            key={mediaItem.id} 
            src={`/api/v1/media/files/${mediaItem.storagePath}`} 
            alt="Post media" 
            className="w-full h-auto object-contain max-h-[600px]" 
          />
        ))}
      </div>
    )}

    {/* Content / Footer */}
    <div className="p-3">
      {/* Action Buttons Placeholder */}
      <div className="flex mb-3">
        <svg className="w-6 h-6 text-gray-800 mr-4 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        <svg className="w-6 h-6 text-gray-800 mr-4 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 8 9 8z"></path></svg>
        <svg className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
      </div>

      <div className="mb-2">
        {post.contentJson.text && (
            <p className="text-sm text-gray-800">
                <span className="font-semibold mr-2">User {post.authorId}</span>
                {post.contentJson.text}
            </p>
        )}
      </div>

      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
      </p>
    </div>
  </div>
);

function Dashboard() {
  console.log('Dashboard component rendered!');
  const { user, accessToken, loading: authLoading, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Dashboard useEffect triggered:', { authLoading, accessToken });
    if (authLoading) {
      console.log('Dashboard: Still authenticating, not fetching posts yet.');
      return;
    }

    if (accessToken) {
      const fetchPosts = async () => {
        setPostsLoading(true);
        console.log('Dashboard: Calling getPosts API...');
        try {
          const familyResponse = await getMyFamily();
          const familyId = familyResponse.data.id;
          localStorage.setItem('familyId', familyId);
          const postsResponse = await getPosts(familyId);
          console.log('Dashboard: Raw posts received from API:', postsResponse.data.posts);
          setPosts(postsResponse.data.posts);
          console.log('Dashboard: Posts fetched:', postsResponse.data.posts);
        } catch (err) {
          setError('Failed to fetch posts.');
          console.error('Dashboard: Error fetching posts.', err);
        } finally {
          setPostsLoading(false);
          console.log('Dashboard: Finished fetching posts. postsLoading set to false.');
        }
      };
      console.log('Dashboard: Token found, initiating fetchPosts.');
      fetchPosts();
    } else {
      setPostsLoading(false);
      console.log('Dashboard: Not authenticated, postsLoading set to false.');
    }
  }, [authLoading, accessToken]);

  if (authLoading) {
    console.log('Dashboard: Displaying Authenticating...');
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p>Authenticating...</p>
      </div>
    );
  }

  if (!accessToken) {
    console.log('Dashboard: Not authenticated. Redirecting to /login.');
    return <Navigate to="/login" replace />;
  }

  if (postsLoading) {
    console.log('Dashboard: Displaying Loading posts...');
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  console.log('Dashboard: Rendering main content. User:', user, 'Posts:', posts);
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

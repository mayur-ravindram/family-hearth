import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { getPosts, getMyFamily } from '../api';

const PostCard = ({ post }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    {post.contentJson.content && <p className="text-gray-800 mb-2">{post.contentJson.content}</p>}
    {post.media && post.media.length > 0 && (
      <div className="mt-2">
        {post.media.map(mediaItem => (
          <img key={mediaItem.id} src={`http://localhost:8080/api/v1/media/files/${mediaItem.storagePath}`} alt="Post media" className="rounded-lg max-w-full" />
        ))}
      </div>
    )}
    <p className="text-gray-500 text-sm mt-2">Posted by User {post.authorId} on {new Date(post.createdAt).toLocaleDateString()}</p>
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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p>Loading posts...</p>
      </div>
    );
  }

  console.log('Dashboard: Rendering main content. User:', user, 'Posts:', posts);
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <Link to="/invite" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Invite Member
          </Link>
        </div>
        <p className="mb-4">Welcome, {user ? user.firstName : 'User'}!</p>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <p>No posts yet. Be the first to share something!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

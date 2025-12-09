import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { getPosts, getMyFamily } from '../api';
import { FixedSizeList as List } from 'react-window';

const MediaItem = ({ mediaItem }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <p className="text-red-500">Failed to load media.</p>;
  }

  return (
    <img
      src={`http://localhost:8080/api/v1/media/files/${mediaItem.storagePath}`}
      alt="Post media"
      className="rounded-lg max-w-full"
      onError={() => setHasError(true)}
    />
  );
};

const PostCard = ({ post }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    {post.contentJson.content && <p className="text-gray-800 mb-2">{post.contentJson.content}</p>}
    {post.media && post.media.length > 0 && (
      <div className="mt-2">
        {post.media.map(mediaItem => (
          <MediaItem key={mediaItem.id} mediaItem={mediaItem} />
        ))}
      </div>
    )}
    <p className="text-gray-500 text-sm mt-2">Posted by User {post.authorId} on {new Date(post.createdAt).toLocaleDateString()}</p>
  </div>
);

// This is the row renderer for react-window
const Row = ({ index, style, data }) => {
  const post = data[index];
  return (
    <div style={style}>
      <PostCard post={post} />
    </div>
  );
};

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
          const postsResponse = await getPosts(familyId);
          setPosts(postsResponse.data.posts);
        } catch (err) {
          setError('Failed to fetch posts.');
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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p>Authenticating...</p>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p>Loading posts...</p>
      </div>
    );
  }

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
            <List
              height={600} // Adjust height as needed
              itemCount={posts.length}
              itemSize={200} // Adjust item size based on your PostCard height
              width="100%"
              itemData={posts}
            >
              {Row}
            </List>
          ) : (
            <div className="text-center">
              <p>No posts yet. Be the first to share something!</p>
              <Link to="/create-post" className="mt-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
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

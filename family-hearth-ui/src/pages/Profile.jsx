import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { createSignedUrl, uploadFile, confirmMedia, updateUser } from '../authedApi';
import { getMediaUrl } from '../utils';

import { getPosts } from '../authedApi';
import PostCard from '../components/PostCard';
function Profile() {
  const { user, loading, authError, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');

  useEffect(() => {
    // Fetch the latest user data when the page loads
    refreshUser();
    fetchUserPosts();

  }, []);

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    setPostsError('');
    try {
      const response = await getPosts(user.id);
      setPosts(response.data.posts);
    } catch (err) {
      setPostsError('Failed to load your posts.');
      console.error('Profile: Error fetching user posts.', err);
    } finally {
      setPostsLoading(false);
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Get a signed URL from the backend
      const signedUrlResponse = await createSignedUrl({
        contentType: selectedFile.type,
      });
      const { uploadUrl, fileId } = signedUrlResponse.data;

      // 2. Upload the file directly to the storage provider (e.g., S3)
      await uploadFile(uploadUrl, selectedFile);

      // 3. Confirm the upload with our backend
      await confirmMedia({ fileId });

      // 4. Update the user's profile to set the new avatar
      await updateUser({ avatarFileId: fileId });

      // 5. Refresh the user context to show the new avatar immediately
      await refreshUser();

      setSuccess('Profile picture updated successfully!');
      setPreview(null);
      setSelectedFile(null);
      setTimeout(() => setSuccess(''), 3000);


    } catch (err) {
      console.error('Upload failed', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading && !user) {
    return <div>Loading profile...</div>;
  }

  if (authError && !user) {
    return <div>Error loading profile. Please try logging in again.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="flex items-center space-x-4">
        <img
          src={preview || getMediaUrl(user?.avatarUrl) || 'https://via.placeholder.com/150'}
          alt="User Avatar"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Update Profile Picture</h2>
        <div className="mt-2">
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Save New Picture'}
          </button>
        </div>
      </div>
      {/* section to load all user's posts */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Your Posts</h2>
        <div className="mt-2">
          {postsLoading ? (
            <p>Loading posts...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
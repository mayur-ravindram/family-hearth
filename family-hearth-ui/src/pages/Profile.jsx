import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { createSignedUrl, uploadFile, confirmMedia, updateUser, createInvite } from '../authedApi';
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
  const [inviteCode, setInviteCode] = useState(null);
  const [maxUses, setMaxUses] = useState(1);
  const [inviteError, setInviteError] = useState('');
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);

  useEffect(() => {
    // Fetch the latest user data when the page loads
    refreshUser();

  }, []);

  const handleCreateInvite = async () => {
    setIsCreatingInvite(true);
    setInviteError('');
    setInviteCode(null);

    try {
      console.log("### User's data:", user);
      const response = await createInvite(user.familyId, { maxUses });
      setInviteCode(response.data.code);
    } catch (err) {
      console.error('Error creating invite:', err);
      setInviteError('Failed to create invite. Please try again.');
    } finally {
      setIsCreatingInvite(false);
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
      const { uploadUrl, mediaId } = signedUrlResponse.data;

      // 2. Upload the file directly to the storage provider (e.g., S3)
      await uploadFile(uploadUrl, selectedFile);

      // 3. Confirm the upload with our backend
      await confirmMedia({ mediaId });

      // 4. Update the user's profile to set the new avatar
      await updateUser({ avatarFileId: mediaId });

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
    <div className="flex flex-col max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center space-x-6">
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

        <div className="flex flex-col mt-6 p-4 border-t border-gray-200">
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
        </div>
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

      <div className="flex flex-col mt-6 p-4 border-t border-gray-200 w-[400px]">
        <h2 className="text-xl font-semibold">Invite Family Member</h2>
        <div className="mt-2">
          <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700">
            Number of uses
          </label>
          <input
            type="number"
            id="maxUses"
            value={maxUses}
            onChange={(e) => setMaxUses(parseInt(e.target.value, 10))}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleCreateInvite}
            disabled={isCreatingInvite}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isCreatingInvite ? 'Creating Invite...' : 'Create Invite'}
          </button>
        </div>
        {inviteError && <p className="text-red-500 text-sm mt-2">{inviteError}</p>}
        {inviteCode && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-semibold">Invite Created!</h3>
            <p className="mt-2">Share this code or link with your family member:</p>
            <p className="mt-1 font-mono bg-gray-200 p-2 rounded">Code: {inviteCode}</p>
            <p className="mt-1 font-mono bg-gray-200 p-2 rounded">
              Link: {`${window.location.origin}/join/${inviteCode}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
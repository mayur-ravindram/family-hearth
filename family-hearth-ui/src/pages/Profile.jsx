import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { createSignedUrl, uploadFile, confirmMedia, updateUser } from '../authedApi';

const Profile = () => {
  const { user, loading, authError } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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
      // This is the new API call we need to add to the backend.
      await updateUser({ avatarFileId: fileId });

      // TODO: Refresh the user context to show the new avatar immediately.
      alert('Profile picture updated successfully! It may take a moment to update everywhere.');

    } catch (err) {
      console.error('Upload failed', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (authError || !user) {
    return <div>Error loading profile. Please try logging in again.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="flex items-center space-x-4">
        <img
          src={preview || user.avatarUrl || '/default-avatar.png'}
          alt="User Avatar"
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
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
    </div>
  );
};

export default Profile;

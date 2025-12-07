import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUploadUrl, uploadFile, confirmFileUpload, createPost } from '../api';

function CreatePostForm() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage('');

    try {
      let mediaIds = [];
      if (file) {
        // 1. Get signed URL
        const { mediaId, uploadUrl } = await getUploadUrl(file.type);

        // 2. Upload file
        await uploadFile(uploadUrl, file);

        // 3. Confirm upload
        await confirmFileUpload(mediaId);
        mediaIds.push(mediaId);
      }

      // 4. Create post
      await createPost({
        type: file ? 'text_and_media' : 'text',
        content: { text },
        mediaIds,
      });

      setMessage('Post created successfully! Redirecting...');
      setText('');
      setFile(null);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.message);
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="create-post-form-container">
      <h2>Create a New Post</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="text">What's on your mind?</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share an update with your family..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Add a photo or video</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn-submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePostForm;
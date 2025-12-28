import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, createSignedUrl, uploadFile, confirmMedia } from '../authedApi';

function CreatePost() {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toastPopover = useRef(null);

  useEffect(() => {
    // If the popover is supported, it can be used.
    // The `popover` attribute is automatically detected.
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview('');
    }
  };

  const showToast = () => {
    if (toastPopover.current) {
      toastPopover.current.showPopover();
      setTimeout(() => {
        toastPopover.current.hidePopover();
        navigate('/dashboard');
      }, 2000);
    } else {
       // Fallback for browsers that don't support popover
      alert('Post created successfully!');
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !file) {
      setError('Please add some content or a file to your post.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      let mediaIds = [];
      let mediaId = null;

      if (file) {
        const signedUrlResponse = await createSignedUrl({
          fileName: file.name,
          contentType: file.type,
        });
        mediaId = signedUrlResponse.data.mediaId;
        const uploadUrl = signedUrlResponse.data.uploadUrl;
        
        await uploadFile(uploadUrl, file);
        mediaIds.push(mediaId);
      }

      const finalPostData = {
        type: file ? 'media' : 'text',
        content: { text: content },
        mediaIds,
      };

      const postResponse = await createPost(finalPostData);

      if (file && mediaId) {
        const postId = postResponse.data.id;
        await confirmMedia({ mediaId, postId });
      }
      
      showToast();

    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <main className="max-w-2xl mx-auto py-8 px-4">
            <div className="max-w-[470px] mx-auto w-full">
                <h1 className="text-xl font-bold text-gray-800 mb-6">Share a Moment</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="post-content" className="sr-only">
                        Your message
                    </label>
                    <textarea
                        className="w-full p-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        id="post-content"
                        rows="4"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="post-media" className="block text-sm font-medium text-gray-700 mb-2">
                        Add a photo
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="post-media" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input id="post-media" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div> 
                </div>

                {preview && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h3>
                        <img src={preview} alt="Image preview" className="rounded-lg w-full object-cover" />
                    </div>
                )}
                
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? 'Sharing...' : 'Share Post'}
                    </button>
                </div>
                </form>
            </div>
        </main>

        <div 
            ref={toastPopover} 
            popover="auto"
            className="fixed top-5 right-5 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg transition-transform"
            style={{ margin: 0 }}
        >
            <p>Post created successfully!</p>
        </div>
    </div>
  );
}export default CreatePost;
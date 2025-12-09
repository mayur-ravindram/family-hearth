import axios from 'axios';
import mockApi from './mockApi'; // Import the mock API

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

let api;

if (USE_MOCK_API) {
  console.log('Using Mock API');
  api = mockApi;
} else {
  console.log('Using Real API');
  api = axios.create({
    baseURL: '/api/v1',
  });

  // Add a request interceptor to include the JWT token in the headers
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

// Export functions that use the chosen api instance
export const requestMagicLink = (email) => api.post('/auth/magic-link', { email });
export const verifyMagicLink = (token) => api.post('/auth/verify', { token });
export const getCurrentUser = () => api.get('/users/me');
export const createFamily = (familyData) => api.post('/families', familyData);
export const getMyFamily = () => api.get('/users/me/family');
export const getPosts = (familyId) => api.get(`/posts/families/${familyId}/posts`);
export const getSignedUrl = (data) => api.post('/media/signed-url', data);
export const uploadFile = (url, file) => axios.put(`/api/v1${url}`, file, {
  headers: { 'Content-Type': file.type }
});
export const confirmMedia = (data) => api.post('/media/confirm', data);

// Updated createPost to handle media
export const createPost = async (postData) => {
  const { content, file } = postData;
  let mediaIds = [];
  let mediaId = null;

  if (file) {
    try {
      // 1. Get signed URL
      const signedUrlResponse = await getSignedUrl({
        fileName: file.name,
        contentType: file.type,
      });
      mediaId = signedUrlResponse.data.mediaId;
      const uploadUrl = signedUrlResponse.data.uploadUrl;

      console.log('Obtained signed URL for media upload:', uploadUrl);
      // 2. Upload file to signed URL
      await uploadFile(uploadUrl, file);

      mediaIds.push(mediaId);
    } catch (error) {
      console.error('File upload failed', error);
      throw error; // Propagate error
    }
  }

  // 3. Create post with media ID
  const finalPostData = {
    type: file ? 'media' : 'text',
    contentJson: { content },
    mediaIds,
  };

  const postResponse = await api.post('/posts', finalPostData);

  // 4. Confirm media if uploaded
  if (file && mediaId) {
    try {
      const postId = postResponse.data.id;
      await confirmMedia({ mediaId, postId });
    } catch (error) {
      console.error('Media confirmation failed', error);
      // Decide on error handling: maybe delete the post, or flag for manual confirmation
      throw error;
    }
  }

  return postResponse;
};
export const createInvite = (familyId, inviteData) => api.post(`/families/${familyId}/invites`, inviteData);
export const acceptInvite = (code, data) => api.post(`/invites/${code}/accept`, data);
// Add other API calls here as needed

// For default export consistency, if needed (though named exports are generally preferred for API functions)
export default api;

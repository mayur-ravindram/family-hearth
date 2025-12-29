import axios from 'axios';
import { refreshToken as fetchRefreshToken } from './api';

const authedApi = axios.create({
  baseURL: '/api/v1',
});

authedApi.interceptors.request.use(
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

authedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await fetchRefreshToken(refreshToken);
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        authedApi.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return authedApi(originalRequest);
      } catch (refreshError) {
        // Redirect to login or handle refresh error
        console.error('Refresh token failed', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('familyId');
        // For example: window.location.href = '/login';
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default authedApi;

export const getCurrentUser = () => authedApi.get('/users/me');
export const updateUser = (userData) => authedApi.patch('/users/me', userData);
export const getMyFamily = () => authedApi.get('/users/me/family');
export const getFamily = (familyId) => authedApi.get(`/families/${familyId}`);
export const createFamily = (familyData) => authedApi.post('/families', familyData);

export const getPosts = (familyId, cursor = null, limit = 20) => {
    const params = {};
    if (cursor) {
        params.cursor = cursor;
    }
    if (limit) {
        params.limit = limit;
    }
    return authedApi.get(`/posts/families/${familyId}/posts`, { params });
};
export const createPost = (postData) => authedApi.post('/posts', postData);

export const createInvite = (familyId, inviteData) => authedApi.post(`/families/${familyId}/invites`, inviteData);

export const createSignedUrl = (data) => authedApi.post('/media/signed-url', data);
export const uploadFile = (uploadUrl, file) => authedApi.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type }
});
export const confirmMedia = (data) => authedApi.post('/media/confirm', data);
export const serveFile = (filename) => authedApi.get(`/media/files/${filename}`);

export const createTimeCapsule = (data) => authedApi.post('/time-capsules', data);
export const syncBatch = () => authedApi.post('/sync/batch');

export const likePost = (postId) => authedApi.post(`/posts/${postId}/likes`);
export const unlikePost = (postId) => authedApi.delete(`/posts/${postId}/likes`);
export const getComments = (postId) => authedApi.get(`/posts/${postId}/comments`);
export const addComment = (postId, commentData) => authedApi.post(`/posts/${postId}/comments`, commentData);


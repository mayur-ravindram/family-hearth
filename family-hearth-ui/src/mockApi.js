// src/mockApi.js
const MOCK_ACCESS_TOKEN = 'mock-access-token-123';
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-456';

const mockUsers = {
  'test@example.com': {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
  },
};

let mockPosts = [
  {
    id: 101,
    authorId: 1,
    type: 'text',
    contentJson: { content: 'This is a mock post from Test User.' },
    media: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 102,
    authorId: 2, // Assuming another user for testing
    type: 'text',
    contentJson: { content: 'Another mock post, not from Test User.' },
    media: [],
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];

let nextFamilyId = 1;
let nextMediaId = 1;
const mockMedia = {};

const mockApi = {
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/auth/magic-link') {
          console.log('Mock API: Magic link requested for', data.email, 'Use token: mock-token');
          resolve({ status: 200, data: { message: 'Mock magic link sent!' } });
        } else if (url === '/auth/verify') {
          console.log('Mock API: Verifying token', data.token);
          if (data.token === 'mock-token') { // A simple mock token for verification
            resolve({ status: 200, data: { accessToken: MOCK_ACCESS_TOKEN, refreshToken: MOCK_REFRESH_TOKEN } });
          } else {
            reject({ response: { status: 400, data: { message: 'Invalid mock token' } } });
          }
        } else if (url === '/families') {
          console.log('Mock API: Creating family', data);
          const newFamily = { id: nextFamilyId++, name: data.name };
          resolve({ status: 201, data: newFamily });
        } else if (url === '/posts') {
          console.log('Mock API: Creating post', data);
          const media = (data.mediaIds || []).map(id => mockMedia[id]).filter(Boolean);
          const newPost = {
            id: mockPosts.length + 1000,
            authorId: 1, // Assume user 1 is always logged in for mock
            type: data.type,
            contentJson: data.contentJson,
            media: media,
            createdAt: new Date().toISOString(),
          };
          mockPosts.unshift(newPost);
          resolve({ status: 201, data: newPost });
        } else if (url === '/media/signed-url') {
          console.log('Mock API: Getting signed URL for', data.fileName);
          const mediaId = nextMediaId++;
          const mockUrl = `/media/upload/${mediaId}`;
          mockMedia[mediaId] = { id: mediaId, url: '', type: data.contentType };
          resolve({ status: 200, data: { url: mockUrl, mediaId: mediaId } });
        } else if (url === '/media/confirm') {
          console.log('Mock API: Confirming media', data);
          resolve({ status: 200, data: { message: 'Media confirmed successfully' } });
        } else {
          reject(new Error(`Mock API: Unhandled POST request to ${url}`));
        }
      }, 500);
    });
  },

  put: (url, file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const match = url.match(/\/media\/upload\/(\d+)/);
        if (match) {
          const mediaId = parseInt(match[1], 10);
          console.log(`Mock API: "Uploading" file for mediaId: ${mediaId}`, file.name);
          // In a real mock, you might use FileReader to get a data URL
          const mockFileUrl = URL.createObjectURL(file);
          if (mockMedia[mediaId]) {
            mockMedia[mediaId].url = mockFileUrl;
          }
          resolve({ status: 200 });
        } else {
          reject(new Error(`Mock API: Unhandled PUT request to ${url}`));
        }
      }, 500);
    });
  },

  get: (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postsMatch = url.match(/\/posts\/families\/(\d+)\/posts/);
        if (url === '/users/me') {
          console.log('Mock API: Getting current user.');
          // In a real scenario, this would check the access token
          resolve({ status: 200, data: mockUsers['test@example.com'] });
        } else if (postsMatch) {
          const familyId = parseInt(postsMatch[1], 10);
          console.log(`Mock API: Getting posts for familyId: ${familyId}`);
          // For mock purposes, let's assume familyId corresponds to authorId
          const userPosts = mockPosts.filter(p => p.authorId === familyId);
          resolve({ status: 200, data: { posts: userPosts } });
        } else {
          reject(new Error(`Mock API: Unhandled GET request to ${url}`));
        }
      }, 500); // Simulate network delay
    });
  },
};

export default mockApi;

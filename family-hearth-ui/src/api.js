const BASE_URL = 'http://localhost:8080/api/v1';

// --- Token Management ---
const getAuthToken = () => localStorage.getItem('jwt');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setAuthToken = (token) => localStorage.setItem('jwt', token);
const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);

const clearAuthTokens = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('family');
  // Force a hard redirect to login to clear all application state
  window.location.href = '/login'; 
};


// --- Refresh Logic ---
// This promise will be shared by all requests that fail with a 401
let refreshingPromise = null;

const refreshToken = async () => {
  try {
    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error("No refresh token available.");
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
    });

    if (!response.ok) {
      // This will be caught by the block below and trigger a logout
      throw new Error('Failed to refresh token');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await response.json();

    if (!newAccessToken) {
      throw new Error("Refresh endpoint did not return a new access token.");
    }

    setAuthToken(newAccessToken);
    // Support for refresh token rotation if the backend provides a new one
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }
    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed, logging out:", error);
    clearAuthTokens(); // Logout the user
    return Promise.reject(error); // Reject the promise so awaiting calls fail
  }
};


// --- Main Fetch Wrapper ---
const fetchWithAuth = async (url, options = {}) => {
  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the initial request
  let response = await fetch(url, { ...options, headers });

  // If the token is expired, try to refresh it
  if (response.status === 401) {
    if (!refreshingPromise) {
      refreshingPromise = refreshToken().finally(() => {
        // Reset the promise once it's settled
        refreshingPromise = null;
      });
    }
    
    try {
      const newToken = await refreshingPromise;
      
      // Retry the request with the new token
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, { ...options, headers });

    } catch (refreshError) {
      // Refreshing failed, the error is handled in refreshToken() (logout).
      // We must not continue. Reject the promise to prevent calling components from proceeding.
      return Promise.reject(refreshError);
    }
  }

  // Handle non-OK responses after potential retry
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Server returned a non-JSON error' }));
    throw new Error(errorData.error || 'An unknown error occurred');
  }
  
  // Handle successful-but-empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }

  return response.json();
};

// --- API Endpoints ---

export const createFamily = async (familyData) => {
  return fetchWithAuth(`${BASE_URL}/families`, {
    method: 'POST',
    body: JSON.stringify(familyData),
  });
};

export const requestMagicLink = async (email) => {
    // This endpoint doesn't need auth, but using fetchWithAuth is safe
    return fetchWithAuth(`${BASE_URL}/auth/magic-link`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  };
  
export const verifyMagicLink = async (token, signal) => {
    // This endpoint doesn't need auth
    return fetchWithAuth(`${BASE_URL}/auth/verify`, {
      method: 'POST',
      body: JSON.stringify({ token }),
      signal,
    });
  };
  
export const getFamilyPosts = async (familyId, cursor = null) => {
    const url = new URL(`${BASE_URL}/posts/families/${familyId}/posts`);
    if (cursor) {
      url.searchParams.append('cursor', cursor);
    }
    return fetchWithAuth(url.toString());
  };
  
export const getUploadUrl = async (contentType) => {
    return fetchWithAuth(`${BASE_URL}/media/signed-url`, {
        method: 'POST',
        body: JSON.stringify({ contentType }),
    });
};

export const uploadFile = async (uploadUrl, file) => {
    // This function uses a pre-signed URL, so it doesn't need our auth wrapper.
    const response = await fetch(BASE_URL+uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type,
        },
    });

    if (!response.ok) {
        throw new Error('File upload failed');
    }
};

export const confirmFileUpload = async (mediaId) => {
    return fetchWithAuth(`${BASE_URL}/media/confirm`, {
        method: 'POST',
        body: JSON.stringify({ mediaId }),
    });
};

export const createPost = async (postData) => {
    return fetchWithAuth(`${BASE_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(postData),
    });
};

export const getCurrentUserFamily = async () => {
    return fetchWithAuth(`${BASE_URL}/users/me/family`);
};

export const getCurrentUser = async () => {
  return fetchWithAuth(`${BASE_URL}/users/me`);
};


export const createInviteCode = async (familyId) => {
    return fetchWithAuth(`${BASE_URL}/families/${familyId}/invites`, {
        method: 'POST',
        body: JSON.stringify({ maxUses: 1 }),
    });
};

export const acceptInvite = async (code, userData) => {
    return fetchWithAuth(`${BASE_URL}/invites/${code}/accept`, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

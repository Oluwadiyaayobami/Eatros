const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('eatroAccessToken') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    credentials: 'include',
    ...options,
    headers,
  };

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check for 401 Unauthorized (except for auth routes to prevent loops)
    if (response.status === 401 && !endpoint.startsWith('/auth/')) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (typeof window !== 'undefined') {
            localStorage.setItem('eatroAccessToken', refreshData.acessToken);
          }
          // Retry original request
          config.headers.Authorization = `Bearer ${refreshData.acessToken}`;
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
          // Both tokens expired or invalid
          if (typeof window !== 'undefined') {
            localStorage.removeItem('eatroAccessToken');
            localStorage.removeItem('eatroUser');
            window.location.href = '/auth/login';
          }
          throw new Error('Session expired');
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('eatroAccessToken');
          localStorage.removeItem('eatroUser');
          window.location.href = '/auth/login';
        }
        throw new Error('Session expired');
      }
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

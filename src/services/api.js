import { apiInit } from '../api/apiInit';

const api = apiInit();

// Add a request interceptor to dynamically inject the JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add a response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// Dashboard
// ----------------------------------------------------------------------
export const fetchDashboardStats = async () => {
  try {
    const { data } = await api.get('/dashboard/stats');
    return data.stats;
  } catch (error) {
    console.error(error);
    return {
      totalDocuments: 0,
      totalQAPairs: 0,
      totalConversations: 0,
      activeKnowledgeSources: 0,
    };
  }
};

export const fetchRecentUploads = async () => {
  try {
    const { data } = await api.get('/documents');
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchActivityFeed = async () => {
  return [
    { id: 1, action: "Logged in via Google", item: "Admin", time: "Just now" },
  ];
};

// ----------------------------------------------------------------------
// Knowledge Base
// ----------------------------------------------------------------------
export const fetchDocuments = async () => {
  try {
    const { data } = await api.get('/documents');
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const uploadDocumentMock = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteDocumentMock = async (id) => {
  try {
    const { data } = await api.delete(`/documents/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

// ----------------------------------------------------------------------
// Q&A Management
// ----------------------------------------------------------------------
export const fetchQAPairs = async () => {
  try {
    const { data } = await api.get('/qa');
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const saveQAPairMock = async (qaData) => {
  try {
    let response;
    if (qaData.id) {
      response = await api.put(`/qa/${qaData.id}`, qaData);
    } else {
      response = await api.post('/qa', qaData);
    }
    // For POST, the new object is in response.data.data
    // For PUT, the backend just returns success, so we return the updated payload
    if (response.data.data) {
      return response.data.data;
    }
    return qaData;
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

export const deleteQAPairMock = async (id) => {
  try {
    const { data } = await api.delete(`/qa/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

// ----------------------------------------------------------------------
// Chat Playground
// ----------------------------------------------------------------------
export const fetchChatSessions = async () => {
  try {
    const { data } = await api.get('/chat/sessions');
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchChatHistory = async (sessionId) => {
  try {
    const { data } = await api.get(`/chat/history/${sessionId}`);
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const sendChatMessageMock = async (message, sessionId = null) => {
  try {
    let sid = sessionId;
    if (!sid) {
      const sessionRes = await api.post('/chat/session', { 
        title: message.substring(0, 30) + '...' 
      });
      sid = sessionRes.data.data.id;
    }

    const { data } = await api.post('/chat/query', {
      session_id: sid,
      message: message
    });
    
    return {
      id: Date.now(), 
      role: 'bot',
      content: data.response,
      sources: data.sources || [],
      sessionId: sid 
    };
  } catch (error) {
    console.error(error);
    return { id: Date.now(), role: 'bot', content: 'An error occurred while fetching the response.', sources: [] };
  }
};

// ----------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------
export const getAIConfig = async () => {
  try {
    const { data } = await api.get('/config');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAIConfig = async (config) => {
  try {
    const { data } = await api.put('/config', config);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAvailableModels = async () => {
  try {
    const { data } = await api.get('/models');
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveSettingsMock = async (settings) => {
  return { success: true };
};

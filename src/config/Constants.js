const HOST = process.env.NODE_ENV === 'development'
  ? 'http://localhost:65530'
  : '';
const API_URL = `${HOST}/api`;

export default {
  HOST,
  API_URL,
  API_LOGIN: `${API_URL}/login`,
  API_LOGOUT: `${API_URL}/logout`,
  API_USER: `${API_URL}/user`,
  API_ROLE: `${API_URL}/role`,
};

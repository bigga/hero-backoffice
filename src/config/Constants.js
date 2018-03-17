const HOST = process.env.NODE_ENV === 'development'
  ? 'http://localhost:65530'
  : '';
const API_URL = `${HOST}/api`;
const API_MESSAGE = `${API_URL}/message`;

export default {
  HOST,
  API_URL,
  API_LOGIN: `${API_URL}/login`,
  API_LOGOUT: `${API_URL}/logout`,
  API_USER: `${API_URL}/user`,
  API_KNOWLEDGE: `${API_URL}/knowledge`,
  API_ROLE: `${API_URL}/role`,
  API_SESSION: `${API_URL}/session`,
  API_MESSAGE,
  API_SEND_MESSAGE: `${API_MESSAGE}/send`,
  API_INVITATION: `${API_URL}/invitation`,
};

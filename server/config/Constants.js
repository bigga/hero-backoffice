import ServerMode from '../utils/ServerMode';

const { isDev } = ServerMode;
const HTTP_PREFIX = 'http://';
const DEV_SERVER = 'localhost:5000';
const REMOTE_API_HOST = `${HTTP_PREFIX}${DEV_SERVER}/v1`;
const LOCAL_API_HOST = '/api';

export default {
  REMOTE_API_HOST,
  REMOTE_API_LOGIN: `${REMOTE_API_HOST}/login`,
  REMOTE_API_USER: `${REMOTE_API_HOST}/user`,
  REMOTE_API_ROLE: `${REMOTE_API_HOST}/role`,
  LOCAL_PORT: process.env.PORT || 65530,
  LOCAL_API_HOST,
  LOCAL_API_LOGIN: `${LOCAL_API_HOST}/login`,
  LOCAL_API_LOGOUT: `${LOCAL_API_HOST}/logout`,
  LOCAL_API_USER: `${LOCAL_API_HOST}/user`,
  LOCAL_API_ROLE: `${LOCAL_API_HOST}/role`,
}
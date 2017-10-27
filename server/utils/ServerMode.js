const mode = process.env.MODE || 'dev';

export default {
  isDev() {
    return mode === 'dev';
  },
  isProd() {
    return mode === 'prod';
  }
}
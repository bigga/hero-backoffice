import baseFetch from './BaseFetch';

export default (method, url, body, options) => {
  return baseFetch(
    method,
    url,
    body,
    options,
    'multipart/form-data'
  );
}
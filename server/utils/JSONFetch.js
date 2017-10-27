import fetch from 'node-fetch';

export default (url, reqBody, options) => {
  const body = reqBody ? JSON.stringify(reqBody) : undefined;
  let status = 0;
  let isError = false;
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-type': 'application/json',
      ...options.headers,
    },
    body,
  })
    .then(response => {
      status = response.status;
      isError = Math.floor(status / 100) !== 2;
      return Promise.resolve(response);
    })
    .then(response => response.json())
    .then(json => {
      if (isError) {
        return Promise.reject(new Error(
          `@API_ERROR_${JSON.stringify({ ...json, status })}`
          ));
      }
      return Promise.resolve(json);
    });
}
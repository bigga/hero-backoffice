import fetch from 'node-fetch';

export default (url, reqBody, options) => {
  let body;
  if (reqBody && reqBody.append) {
    body = reqBody;
  } else {
    body = reqBody ? JSON.stringify(reqBody) : undefined;
  }

  let status = 0;
  let isError = false;

  let contentType;
  if (!reqBody || !reqBody.append) {
    contentType = {'Content-type': 'application/json'};
  }

  return fetch(url, {
    ...options,
    headers: {
      ...contentType,
      ...options.headers,
    },
    body,
  })
    .then(response => {
      status = response.status;
      isError = Math.floor(status / 100) !== 2;
      return Promise.resolve(response);
    })
    .then(response => response.text())
    .then(text => {
      console.log('>>response_text<<', text);

      let json = JSON.parse(text);
      if (isError) {
        return Promise.reject(new Error(
          `@API_ERROR_${JSON.stringify({ ...json, status })}`
          ));
      }
      return Promise.resolve(json);
    });
}
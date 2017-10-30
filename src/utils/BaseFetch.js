import axios from 'axios';

export default (method, url, body, options, contentType) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': contentType,
  };
  
  return Promise.resolve()
    .then(() => {
      return axios({
        method,
        url,
        headers,
        withCredentials: true,
        data: body,
        ...(options || {}),
      });
    })
    .then(response => {
      const { status } = response;
      const data = response.data;
      if (status < 200 || status >= 300) {
        return Promise.reject(new Error(`@JSON_${JSON.stringify(data)}`));
      }
      console.log('>>fetch_response<<', method, url, response);
      return Promise.resolve(data);
    })
    .catch(error => {
      if (!error.response) {
        return Promise.resolve(error);
      }
      
      const { response } = error;
      const { data } = response;
      return Promise.reject(new Error(`@JSON_${JSON.stringify(data)}`));
    });
}
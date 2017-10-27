export default res => {
  return error => {
    if (!error) return;
    let { message } = error;
    if (message.indexOf('@API_ERROR_') === 0) {
      message = message.replace('@API_ERROR_', '');
      const data = JSON.parse(message);
      res.status(data.status).send({ message: data.message });
    }
    res.send({ message: error.message });
  };
}
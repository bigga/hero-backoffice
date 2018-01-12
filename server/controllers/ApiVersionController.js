export default class ApiVersionController {
  list(req, res) {
    res.send({version: '0.0.1'});
  }
};

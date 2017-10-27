export default class ApiLoginController {
  get(req, res) {
    res.send(req.session.api.user);
  }
};
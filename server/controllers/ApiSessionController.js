export default class ApiSessionController {
  get(req, res) {
    res.send(req.session.api.user);
  }
};
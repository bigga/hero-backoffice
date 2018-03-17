export default class ApiSessionController {
  get(req, res) {
    if (!req.session || !req.session.api) {
      return res.send(null);
    }
    res.send(req.session.api.user);
  }
};
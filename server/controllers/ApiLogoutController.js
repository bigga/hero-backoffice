export default class LogoutController {
  post(req, res) {
    req.session.destroy();
    res.status(200).send({ success: true });
  }
}
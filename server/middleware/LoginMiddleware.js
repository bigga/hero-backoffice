export default class LoginMiddleware {
  check({ req, res }) {
    const { path } = req;
    const restrictedPaths = [
      '/',
      '/user'
    ];
    
    if (restrictedPaths.indexOf(path) !== -1 &&
      (!req.session || !req.session.api || !req.session.api.token)) {
      res.redirect('/login');
      return Promise.reject();
    }
    
    if ((path === '/' || path === '/login') &&
      (req.session && req.session.api && req.session.api.token)) {
      res.redirect('/user');
      return Promise.reject();
    }
    
    return Promise.resolve();
  }
};

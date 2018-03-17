import fetch from '../utils/JSONFetch';
import Constants from '../config/Constants';
import createFallback from '../utils/ApiFallbackCreator';

export default class ApiLoginController {
  post(req, res) {
    const { email, password } = req.body || {};
    Promise.resolve()
      .then(() => {
        if (!email || !password) {
          res.status(401).send({ message: 'UNAUTHENTICATED' });
          return Promise.reject(null);
        }
        return Promise.resolve();
      })
      .then(() => {
        return fetch(Constants.REMOTE_API_LOGIN, { email, password }, {
          method: 'POST',
        });
      })
      .then(session => {
        if (!session) {
          res.status(401).send({ message: 'UNAUTHENTICATED' });
          return Promise.reject(null);
        }
        
        const { user } = session;
        console.log('>>role<<', user.role.name);
        if (!user || !user.role ||
          (user.role.name !== 'admin' && user.role.name !== 'manager' && user.role.name !== 'consultant')) {
          res.status(401).send({ message: 'UNAUTHENTICATED' });
          return Promise.reject(null);
        }
        req.session.api = session;
        console.log('>>session<<', session);
        res.send(user);
      })
      .catch(createFallback(res));
  }
};
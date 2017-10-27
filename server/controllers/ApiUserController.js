import fetch from '../utils/JSONFetch';
import Constants from '../config/Constants';
import createFallback from '../utils/ApiFallbackCreator';

export default class ApiUserController {
  get(req, res) {
    Promise.resolve()
      .then(() => {
        return fetch(Constants.REMOTE_API_USER, null, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(users => {
        res.send(users);
        return Promise.resolve(users);
      })
      .catch(createFallback(res));
  }
  
  post(req, res) {
    const { email, name, roleId } = req.body;
    Promise.resolve()
      .then(() => {
        return fetch(Constants.REMOTE_API_USER, {
          email, name, roleId, password: ''
        }, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(user => {
        res.send(user);
        return Promise.resolve(user);
      })
      .catch(createFallback(res));
  }
  
  delete(req, res) {
    const { id } = req.params;
    Promise.resolve()
      .then(() => {
        return fetch(`${Constants.REMOTE_API_USER}/${id}`, null, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(user => {
        res.send(user);
        return Promise.resolve(user);
      })
      .catch(createFallback(res));
  }
}
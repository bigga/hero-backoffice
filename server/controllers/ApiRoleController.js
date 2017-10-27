import fetch from '../utils/JSONFetch';
import Constants from '../config/Constants';
import createFallback from '../utils/ApiFallbackCreator';

export default class ApiRoleController {
  
  static masterRoles = [];
  
  get(req, res) {
    const { masterRoles } = ApiRoleController;
    if (masterRoles && masterRoles.length) {
      res.send(masterRoles);
      return Promise.resolve(masterRoles);
    }
    
    Promise.resolve()
      .then(() => {
        return fetch(Constants.REMOTE_API_ROLE, null, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(roles => {
        ApiRoleController.masterRoles = roles;
        res.send(roles);
        return Promise.resolve(roles);
      })
      .catch(createFallback(res));
  }
};
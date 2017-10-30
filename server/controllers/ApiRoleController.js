import fetch from '../utils/JSONFetch';
import Constants from '../config/Constants';
import createFallback from '../utils/ApiFallbackCreator';

export default class ApiRoleController {
  
  static masterRoles = [];
  
  list(req, res) {
    const { masterRoles } = ApiRoleController;
    if (masterRoles && masterRoles.length) {
      res && res.send(masterRoles);
      return Promise.resolve(masterRoles);
    }
    
    return Promise.resolve()
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
        res && res.send(roles);
        return Promise.resolve(roles);
      })
      .catch(createFallback(res));
  }
};
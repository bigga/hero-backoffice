import xlsx from 'node-xlsx';

import fetch from '../utils/JSONFetch';
import Constants from '../config/Constants';
import createFallback from '../utils/ApiFallbackCreator';
import ApiRoleController from "./ApiRoleController";

export default class ApiUserController {
  list(req, res) {
    return Promise.resolve()
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
  
  store(req, res) {
    const { email, name, roleId } = req.body;
    return Promise.resolve()
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
  
  readExcel(req, res) {
    const { excel } = req.files || {};
    let roles;
    
    return Promise.resolve()
      .then(() => new ApiRoleController().list(req))
      .then(apiRoles => {
        roles = apiRoles || [];
        return Promise.resolve();
      })
      .then(() => {
        if (!excel || !excel.length) {
          return Promise.reject(new Error('FILE_NOT_UPLOADED'));
        }
        return Promise.resolve();
      })
      .then(() => {
        let excelData;
        try {
          excelData = xlsx.parse(excel.shift().buffer);
        } catch (error) {
          return Promise.reject(new Error('FILE_WRONG_MIMETYPE'));
        }
        
        if (!excelData || !excelData.length) {
          return Promise.reject(new Error('FILE_NO_DATA'));
        }
        
        const [worksheet] = excelData;
        const { data: worksheetData } = worksheet;
        
        return Promise.resolve(worksheetData);
      })
      .then(worksheetData => {
        return Promise.all((worksheetData || []).map(row => {
          const [ name, email, role ] = row;
          const nameInvalid = !name;
          const foundRoles = roles.filter(r => r.name === role);
          const roleInvalid = foundRoles.length === 0;
          
          return fetch(`${Constants.REMOTE_API_USER}/validate`, { email }, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${req.session.api.token}`,
            }
          }).then(({ valid: emailValid }) => {
            return Promise.resolve({
              name,
              email,
              role,
              roleId: foundRoles.length ? foundRoles.shift().id : null,
              invalid: [
                nameInvalid && 'name',
                !emailValid && 'email',
                roleInvalid && 'role',
              ].filter(v => v)
            });
          });
        }));
      })
      .then(formattedData => {
        res.send(formattedData);
        return Promise.resolve(formattedData);
      })
      .catch(createFallback(res));
  }
  
  destroy(req, res) {
    const { id } = req.params;
    return Promise.resolve()
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
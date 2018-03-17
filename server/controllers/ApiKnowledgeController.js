import fs from 'fs';
import FormData from 'form-data';
import fetch from '../utils/JSONFetch';

import Constants from '../config/Constants';
import createFallback from '../utils/ApiFallbackCreator';
import ApiRoleController from "./ApiRoleController";

export default class ApiKnowledgeController {
  list(req, res) {
    const url = `${Constants.REMOTE_API_KNOWLEDGE}`;
    return Promise.resolve()
      .then(() => {
        return fetch(url, null, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(knowledge => {
        res.send(knowledge);
        return Promise.resolve(knowledge);
      })
      .catch(createFallback(res));
  }

  getOne(req, res) {
    const { id } = req.params;
    const url = `${Constants.REMOTE_API_KNOWLEDGE}/${id}`;
    console.log(url);
    return Promise.resolve()
      .then(() => {
        return fetch(url, null, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(knowledge => {
        res.send(knowledge);
        return Promise.resolve(knowledge);
      })
      .catch(createFallback(res));
  }

  store(req, res) {
    const { file } = req;
    const { nameEN, nameTH, url } = req.body || {};
    return Promise.resolve()
      .then(() => {
        if (!file && !url) {
          return Promise.reject(new Error('FILE_NOT_UPLOADED_OR_WRONG_URL'));
        }
        return Promise.resolve();
      })
      .then(() => {
        const formData = new FormData();
        formData.append('name_en', nameEN);
        formData.append('name_th', nameTH);
        if (file) {
          formData.append('file', fs.createReadStream(file.path));
        }
        if (url) {
          formData.append('url', url);
        }

        return fetch(Constants.REMOTE_API_KNOWLEDGE, formData, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(knowledge => {
        res.send(knowledge);
        return Promise.resolve(knowledge);
      })
      .catch(createFallback(res));
  }

  update(req, res) {
    const { file } = req;
    const { id } = req.params;
    const { url, nameEN, nameTH } = req.body || {};

    return Promise.resolve()
      .then(() => {
        const formData = new FormData();
        formData.append('name_en', nameEN);
        formData.append('name_th', nameTH);
        if (url) {
          formData.append('url', url);
        }
        if (file) {
          formData.append('file', fs.createReadStream(file.path));
        }

        return fetch(`${Constants.REMOTE_API_KNOWLEDGE}/${id}`, formData, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(knowledge => {
        res.send(knowledge);
        return Promise.resolve(knowledge);
      })
      .catch(createFallback(res));
  }

  destroy(req, res) {
    const { id } = req.params;
    return Promise.resolve()
      .then(() => {
        return fetch(`${Constants.REMOTE_API_KNOWLEDGE}/${id}`, null, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(knowledge => {
        res.send(knowledge);
        return Promise.resolve(knowledge);
      })
      .catch(createFallback(res));
  }
}


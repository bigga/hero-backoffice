import fetch from "../utils/JSONFetch";
import FormData from "form-data";

import Constants from "../config/Constants";
import createFallback from "../utils/ApiFallbackCreator";

export default class ApiInvitationController {

  get(req, res) {
    const url = `${Constants.REMOTE_API_INVITATION}`;
    console.log('>>token<<', url, req.session.api.token);
    return Promise.resolve()
      .then(() => {
        return fetch(url, null, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(invitations => {
        res.send(invitations);
      })
      .catch(createFallback(res));
  }

  accept(req, res) {
    const { id:invitationKey } = req.params;
    const url = `${Constants.REMOTE_API_INVITATION}/${invitationKey}/accept`;
    console.log('>>token<<', url, req.session.api.token);
    return Promise.resolve()
      .then(() => {
        return fetch(url, null, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(invitation => {
        res.send(invitation);
      })
      .catch(createFallback(res));
  }

  decline(req, res) {
    const { id:invitationKey } = req.params;
    const url = `${Constants.REMOTE_API_INVITATION}/${invitationKey}/decline`;
    console.log('>>token<<', url, req.session.api.token);
    return Promise.resolve()
      .then(() => {
        return fetch(url, null, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      .then(invitation => {
        res.send(invitation);
      })
      .catch(createFallback(res));
  }

}
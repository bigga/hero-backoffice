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

}
import fetch from "../utils/JSONFetch";
import FormData from "form-data";

import Constants from "../config/Constants";
import createFallback from "../utils/ApiFallbackCreator";

export default class ApiChatController {

  sendMessage(req, res) {
    const url = `${Constants.REMOTE_API_SEND_MESSAGE}`;
    const { message, room, type } = req.body || {};

    console.log('>>message_room<<', message, room);
    const formData = new FormData();
    formData.append('message', message);
    formData.append('chatroom_id', room);
    formData.append('type', type);

    return Promise.resolve()
      .then(() => {
        return fetch(url, formData, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${req.session.api.token}`,
          }
        });
      })
      // .then(sendMessageResult => {
      //   res.send({ sendMessageResult });
      //   return Promise.resolve(sendMessageResult);
      // })
      .catch(createFallback(res));
  }

}
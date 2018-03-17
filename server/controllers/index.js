import multer from 'multer';
import mime from 'mime';
import crypto from 'crypto';

import Constants from '../config/Constants';
import LoginController from './ApiLoginController';
import LogoutController from './ApiLogoutController';
import SessionController from './ApiSessionController';
import ApiUserController from './ApiUserController';
import ApiRoleController from './ApiRoleController';
import ApiVersionController from './ApiVersionController';
import ApiKnowledgeController from './ApiKnowledgeController';
import ApiChatController from './ApiChatController';
import ApiInvitationController from "./ApiInvitationController";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/');
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.'
        + mime.extension(file.mimetype));
    });
  }
});
const fileUpload = multer({ storage:tempStorage });

const login = new LoginController();
const logout = new LogoutController();
const session = new SessionController();
const user = new ApiUserController();
const role = new ApiRoleController();
const knowledge = new ApiKnowledgeController();
const version = new ApiVersionController();
const chat = new ApiChatController();
const invitation = new ApiInvitationController();

export default {
  setup(app) {
    app
      // Login
      .post(Constants.LOCAL_API_LOGIN, login.post)
      // Logout
      .post(Constants.LOCAL_API_LOGOUT, logout.post)
      // User
      .get(Constants.LOCAL_API_USER, user.list)
      .get(`${Constants.LOCAL_API_USER}/:id`, user.getOne)
      .put(`${Constants.LOCAL_API_USER}/:id`, user.update)
      .post(Constants.LOCAL_API_USER, user.store)
      .post(`${Constants.LOCAL_API_USER}/excel`,
        upload.fields([
          { name: 'excel', maxCount: 1 }
        ]),
        user.readExcel)
      .delete(`${Constants.LOCAL_API_USER}/:id`, user.destroy)
      // Knowledge
      .get(Constants.LOCAL_API_KNOWLEDGE, knowledge.list)
      .get(`${Constants.LOCAL_API_KNOWLEDGE}/:id`, knowledge.getOne)
      .post(Constants.LOCAL_API_KNOWLEDGE,
        fileUpload.single('file'),
        knowledge.store)
      .put(`${Constants.LOCAL_API_KNOWLEDGE}/:id`,
        fileUpload.single('file'),
        knowledge.update)
      .delete(`${Constants.LOCAL_API_KNOWLEDGE}/:id`, knowledge.destroy)
      // Role
      .get(Constants.LOCAL_API_ROLE, role.list)
      // Chat
      .post(Constants.LOCAL_API_SEND_MESSAGE, chat.sendMessage)
      // Version
      .get(Constants.LOCAL_API_VERSION, version.list)
      // Session
      .get(Constants.LOCAL_API_SESSION, session.get)
      // Invitation
      .get(Constants.LOCAL_API_INVITATION, invitation.get)
      .post(`${Constants.LOCAL_API_INVITATION}/:id/accept`, invitation.accept)
      .post(`${Constants.LOCAL_API_INVITATION}/:id/decline`, invitation.decline);
  }
  
};
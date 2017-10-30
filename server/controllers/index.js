import multer from 'multer';

import Constants from '../config/Constants';
import LoginController from './ApiLoginController';
import LogoutController from './ApiLogoutController';
import SessionController from './ApiSessionController';
import ApiUserController from "./ApiUserController";
import ApiRoleController from './ApiRoleController';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const login = new LoginController();
const logout = new LogoutController();
const user = new ApiUserController();
const role = new ApiRoleController();

export default {
  setup(app) {
    app
      // Login
      .post(Constants.LOCAL_API_LOGIN, login.post)
      // Logout
      .post(Constants.LOCAL_API_LOGOUT, logout.post)
      // User
      .get(Constants.LOCAL_API_USER, user.list)
      .post(Constants.LOCAL_API_USER, user.store)
      .post(`${Constants.LOCAL_API_USER}/excel`,
        upload.fields([
          { name: 'excel', maxCount: 1 }
        ]),
        user.readExcel)
      .delete(`${Constants.LOCAL_API_USER}/:id`, user.destroy)
      // Role
      .get(Constants.LOCAL_API_ROLE, role.list);
  }
};
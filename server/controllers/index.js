import Constants from '../config/Constants';
import LoginController from './ApiLoginController';
import LogoutController from './ApiLogoutController';
import SessionController from './ApiSessionController';
import ApiUserController from "./ApiUserController";
import ApiRoleController from './ApiRoleController';

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
      .get(Constants.LOCAL_API_USER, user.get)
      .post(Constants.LOCAL_API_USER, user.post)
      .delete(`${Constants.LOCAL_API_USER}/:id`, user.delete)
      // Role
      .get(Constants.LOCAL_API_ROLE, role.get);
  }
};
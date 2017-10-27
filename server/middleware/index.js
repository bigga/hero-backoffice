import LoginMiddleware from './LoginMiddleware';

const login = new LoginMiddleware();

export default {
  setup(app) {
    app.use((req, res, next) => {
      Promise.resolve({ req, res })
        .then(login.check)
        .then(() => {
          next();
          return Promise.resolve();
        });
    });
  }
};

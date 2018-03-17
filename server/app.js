import uuid from 'uuid';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import controllers from './controllers';
import middleware from './middleware';

import Constants from './config/Constants';
import ServerMode from "./utils/ServerMode";

const app = express();
const FileStore = require('session-file-store')(session);

app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(cookieParser());
app.use(morgan(':remote-addr - :remote-user [:date[clf]] "method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

const sessionOptions = {
  path: './tmp/sessions/',
  useAsync: true,
  reapInterval: 5000,
  maxAge: 10000,
};
app.use(
  session({
    genid(req) {
      const id = uuid.v4();
      console.log(`New session: ${id}`);
      return id;
    },
    secret: '1234567890QWERTY',
    resave: false,
    store: new FileStore(sessionOptions),
    saveUninitialized: true,
    cookie: {
      maxAge: null,
      secure: false,
      httpOnly: false,
    },
  }),
);

if (ServerMode.isDev()) {
  app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
}

// Set up controllers
controllers.setup(app);

// Set up middleware
middleware.setup(app);

app.use('/static', express.static(path.resolve(__dirname, '..', 'build', 'static')));
app.use('/fonts', express.static(path.resolve(__dirname, '..', 'build', 'fonts')));
app.use('/css', express.static(path.resolve(__dirname, '..', 'build', 'css')));
// app.use('/service-worker.js', express.static(path.resolve(__dirname, '..', 'build', 'service-worker.js')));
// app.use('/manifest.json', express.static(path.resolve(__dirname, '..', 'build', 'manifest.json')));
// app.use('/favicon.ico', express.static(path.resolve(__dirname, '..', 'build', 'favicon.ico')));
// app.use('/asset-manifest.json', express.static(path.resolve(__dirname, '..', 'build', 'asset-manifest.json')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(Constants.LOCAL_PORT, () => {
  console.log('>>server_started<<');
});
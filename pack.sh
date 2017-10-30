#!/bin/sh

npm run build
mkdir -p ../hero-backoffice-prod/server
cp -rf ./build ../hero-backoffice-prod/build
cp -rf ./server/config ../hero-backoffice-prod/server/config
cp -rf ./server/controllers ../hero-backoffice-prod/server/controllers
cp -rf ./server/middleware ../hero-backoffice-prod/server/middleware
cp -rf ./server/utils ../hero-backoffice-prod/server/utils
cp -rf ./server/.babelrc ../hero-backoffice-prod/server/.babelrc
cp -rf ./server/app.js ../hero-backoffice-prod/server/app.js
cp -rf ./server/package.json ../hero-backoffice-prod/server/package.json
cd ../hero-backoffice-prod
git add build
git add server
git commit -a -m 'new version'
git push origin master
cd ../hero-backoffice

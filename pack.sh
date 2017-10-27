#!/bin/sh

cp -rf ./build ../hero-backoffice-prod/build
cp -rf ./server ../hero-backoffice-prod/server
cd ../hero-back-office-prod
git add *
git commit -a -m 'new version'
git push origin master
cd hero-back-office

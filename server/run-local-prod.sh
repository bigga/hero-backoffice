#!/bin/sh

MODE=dev nodemon app.js --exec ./node_modules/.bin/babel-node app.js

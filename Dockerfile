FROM node:7.9.0-alpine

# Set a working directory
WORKDIR /usr/src/app

ADD ./build /usr/src/app/build
ADD ./server /user/src/app/server

# Install Node.js dependencies
RUN npm install --prefix ./server

CMD [ "./node_modules/.bin/babel-node", "server/app.js" ]
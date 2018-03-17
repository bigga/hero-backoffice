import React from 'react';

import firebase from '../../utils/Firebase';
import ChatRoomList from "./ChatRoomList";
import ChatLog from "./ChatLog";

import apiFetch from "../../utils/ApiFetch";
import Constants from "../../config/Constants";
import Layout from "../../components/layout/Layout";

import s from './ChatPage.css';
import gs from '../../components/global.css';

export default class ChatPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      chatRoom: null,
      database: null,
    }
  }

  componentWillMount() {
    this.initFirebase();
  }

  initFirebase() {
    let userId, chatName;
    Promise.resolve()
      .then(() => {
        return apiFetch('GET', Constants.API_SESSION);
      })
      .then(session => {
        userId = session.id;
        chatName = session.name;
        this.setState({
          userId
        });
        return Promise.resolve();
      })
      .then(() => {
        return firebase
          .auth()
          .signInAnonymously();
      })
      .then(() => {
        if (!userId || !chatName) {
          return Promise.reject(new Error('User does not exist'));
        }

        return firebase
          .database()
          .ref(`users/${userId}`)
          .set({
            name: chatName,
          });
      })
      .then(() => {
        this.setState({
          database: firebase.database()
        })
      });
  }

  startChat(chatRoom) {
    const { database, chatRoom:prevChatRoom } = this.state;
    if (prevChatRoom) {
      database.ref(`messages/${prevChatRoom.key}`).off('child_added');
    }
    this.setState({
      chatRoom
    });
  }

  render() {
    const {userId, database, chatRoom} = this.state;
    return (
      <Layout loggedIn>
        <div className={gs.adminRoot}>
          <div className={s.container}>
            <div className={s.leftPanel}>
              <ChatRoomList page={this} database={database}/>
            </div>
            <div className={s.rightPanel}>
              <ChatLog page={this} userId={userId} database={database} chatRoom={chatRoom}/>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
};
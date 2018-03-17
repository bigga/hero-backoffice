import React from 'react';
import cx from 'classnames';

import apiFetch from '../../utils/ApiFetch';
import Constants from '../../config/Constants';

import s from './ChatLog.css';
import gs from '../../components/global.css';

export default class ChatLog extends React.Component {

  constructor(props) {
    super(props);
    const { database, chatRoom } = this.props;
    this.monitorMessages(database, chatRoom);

    this.state = {
      clickedMessageId: 0,
      currentMessage: '',
      messages: []
    };
  }

  componentWillReceiveProps(nextProps) {
    const { chatRoom:currentChatRoom } = this.props;
    const { database, chatRoom:nextChatRoom } = nextProps;
    if (currentChatRoom !== nextChatRoom) {
      this.state = {
        currentMessage: '',
        messages: []
      };
      this.monitorMessages(database, nextChatRoom);
    }
  }

  onCurrentMessageChange(event) {
    const { target: { value:currentMessage }} = event;
    this.setState({
      currentMessage
    })
  }

  onCurrentMessagePress(event) {
    const { key } = event;
    if (key === 'Enter') {
      this.sendMessage();
    }
  }

  onMessageClick(clickedMessageId) {
    this.setState({
      clickedMessageId,
    });
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  monitorMessages(database, chatRoom) {
    if (!database || !chatRoom) {
      return;
    }

    const { key } = chatRoom;
    database.ref(`messages/${key}`).on('child_added', this.callback = snap => {
      let { messages } = this.state;
      const { key } = snap;
      const meta = snap.val();
      const message = { key, meta };
      messages = messages
        .concat([message])
        .sort((a, b) => a.meta && b.meta && a.meta.timestamp - b.meta.timestamp);
      this.setState({
        messages
      });
      this.scrollToBottom();
    });
  }

  sendMessage() {
    this.setState({
      currentMessage: '',
    });

    const { chatRoom: { key } } = this.props;
    const { currentMessage } = this.state;

    const body = `message=${currentMessage}&room=${key}&type=text`;
    apiFetch('POST', Constants.API_SEND_MESSAGE, body)
      .catch(error => {
        const { message } = error;
        if (message.indexOf('@JSON_') === 0) {
          const data = JSON.parse(message.replace('@JSON_', ''));
          const { message: boxError } = data;
          this.setState({ boxError });
        }
      });
  }

  render() {
    const { userId } = this.props;
    const { currentMessage, messages, clickedMessageId } = this.state;
    return (
      <div className={cx(gs.adminContainer, s.container)}>
        <div className={s.messages}>
          <ul>
            {
              messages.map(message => {
                const date = new Date(message.meta.timestamp);
                const dateText = date.toLocaleDateString();
                const timeText = date.toLocaleTimeString();
                return (
                  <li className={message.meta.sender === userId ? s.mine : null}
                    onClick={() => this.onMessageClick(message.key)}>
                    <div className={s.message} key={message.key}>
                      {message.meta.message}
                    </div>
                    {
                      message.key === clickedMessageId ? (
                        <div className={s.date}>
                          {dateText} {timeText}
                        </div>
                      ) : null
                    }
                  </li>
                )
              })
            }
          </ul>
          <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }} />
        </div>
        <div className={s.messageInput}>
          <input className={s.text} type="text" value={currentMessage}
                 onKeyPress={event => this.onCurrentMessagePress(event)}
                 onChange={event => this.onCurrentMessageChange(event)} />
          <button className={s.submit} type="button" onClick={() => this.sendMessage()}>
            Send
          </button>
        </div>
      </div>
    )
  }
};
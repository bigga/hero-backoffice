import React from 'react';
import cx from 'classnames';

import s from './ChatRoomList.css';
import gs from '../../components/global.css';

export default class ChatRoomList extends React.Component {

  constructor(props) {
    super(props);
    this.monitorChatRoom(props.database);
    this.state = {
      selectedRoomKey: '',
      chatRooms: []
    };
    this.firstChatRoom = true;
  }

  componentWillReceiveProps(nextProps) {
    const { database:currentDatabase } = this.props;
    const { database:nextDatabase } = nextProps;
    console.log('>>db<<', currentDatabase, nextDatabase);
    if (nextDatabase !== currentDatabase) {
      this.monitorChatRoom(nextDatabase);
    }
  }

  monitorChatRoom(database) {
    if (!database) {
      return;
    }

    database.ref('chatrooms')
      .on('child_added', snapshot => {
        const { key } = snapshot;
        const meta = snapshot.val();
        this.addChatRoom(key, meta);
      });
  }

  addChatRoom(key, meta) {
    const { chatRooms } = this.state;
    const name = meta.name || Object.values(meta.members || [])
      .map(member => member.name)
      .join(', ');
    const chatRoom = { key, name, meta };
    this.setState({
      chatRooms: [...chatRooms, chatRoom]
    });

    if (this.firstChatRoom) {
      this.startChat(chatRoom);
      this.firstChatRoom = false;
    }
  }

  startChat(chatRoom) {
    const { page } = this.props;
    page.startChat(chatRoom);
    this.setState({
      selectedRoomKey: chatRoom.key
    });
  }

  render() {
    const { selectedRoomKey, chatRooms } = this.state;
    return (
      <div className={cx(gs.adminContainer, s.container)}>
        <ul className={s.chatRoomList}>
          {
            chatRooms.map(chatRoom => {
              const { key, name } = chatRoom;
              return (
                <li className={cx(s.chatRoom, selectedRoomKey === key ? s.selected : null)}
                    key={key} onClick={() => this.startChat(chatRoom)}>
                  { name }
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}
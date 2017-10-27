import React from 'react';
import Header from '../header/Header';

import s from './Layout.css';

export default class Layout extends React.Component {
  render() {
    const { loggedIn } = this.props;
    return (
      <div className={s.root}>
        <div className={s.background} />
        <Header parent={this} loggedIn={loggedIn} />
        {this.props.children}
      </div>
    );
  }
}
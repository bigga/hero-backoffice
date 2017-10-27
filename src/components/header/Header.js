import React from 'react';
import cx from 'classnames';

import Constants from '../../config/Constants';
import apiFetch from '../../utils/ApiFetch';

import s from './Header.css';

import imgLogo from '../../images/hero-logo.png';

export default class Header extends React.Component {
  
  componentWillMount() {
    const { parent, pageName } = this.props;
    this.parent = parent;
    this.pageName = pageName;
  }
  
  menuItems = {
    user: 'Users',
  };
  
  onSignOut() {
    apiFetch('POST', Constants.API_LOGOUT)
      .then(() => window.location.href = '/');
  }
  
  renderMenu() {
    return (
      <div className={s.menu}>
        {Object.keys(this.menuItems).map((key, index, array) => (
          <span key={index}>
            <a
              href={`/${key}`}
              className={key === this.pageName ? s.selected : null}
            >
              {this.menuItems[key]}
            </a>
            {index !== array.length - 1 ? (
              <span className={s.separator}> | </span>
            ) : null}
          </span>
        ))}
      </div>
    );
  }
  
  render() {
    const { loggedIn } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.banner}>
            <img className={s.bannerTitle} src={imgLogo} alt="" />
          </div>
          {loggedIn ? (
            <div className={s.dropdown}>
              <button className={s.dropbtn}>☰</button>
              <div className={s.dropdownContent}>
                <a onClick={() => this.onSignOut()}>Sign Out</a>
              </div>
            </div>
          ) : null}
        </div>
        {loggedIn ? (
          this.renderMenu()
        ) : (
          <div className={cx(s.menu, s.admin)}>Administration Console</div>
        )}
      </div>
    )
  }
}
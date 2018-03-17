import React from 'react';
import cx from 'classnames';

import Constants from '../../config/Constants';
import apiFetch from '../../utils/ApiFetch';

import s from './Header.css';

import imgLogo from '../../images/hero-logo.png';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      role: {},
    };
  }

  componentWillMount() {
    const { parent, pageName } = this.props;
    this.parent = parent;
    this.pageName = pageName;
    this.fetchSession();
  }
  
  menuItems = {
    user: 'Users',
  };

  fetchSession() {
    return apiFetch('GET', `${Constants.API_SESSION}`)
      .then(user => {
        if (!user) {
          return;
        }
        this.setState({
          role: (user || {}).role
        });
      });
  }
  
  onSignOut() {
    apiFetch('POST', Constants.API_LOGOUT)
      .then(() => window.location.href = '/');
  }

  onPressUser() {
    window.location.href = '/user';
  }

  onPressKnowledge() {
    window.location.href = '/knowledge';
  }

  onPressInvitation() {
    window.location.href = '/invitation';
  }

  onPressConsultation() {
    window.location.href = '/chat';
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
    const { role } = this.state;

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
                {
                  role.name === 'admin' ? (
                    <div>
                      <a onClick={() => this.onPressUser()}>User</a>
                      <a onClick={() => this.onPressKnowledge()}>Knowledge</a>
                    </div>
                  ) : null
                }
                {
                  role.name === 'consultant' ? (
                    <div>
                      <a onClick={() => this.onPressConsultation()}>Consultation</a>
                      <a onClick={() => this.onPressInvitation()}>Invitation</a>
                    </div>
                  ): null
                }
                <hr/>
                <a onClick={() => this.onSignOut()}>Sign Out</a>
              </div>
            </div>
          ) : null}
        </div>
        <div className={cx(s.menu, s.admin)}>Administration Console</div>
      </div>
    )
  }
}
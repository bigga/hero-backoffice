import React from 'react';
import cx from 'classnames';
import apiFetch from '../../utils/ApiFetch';

import Layout from '../../components/layout/Layout';

import s from './LoginPage.css';
import Constants from "../../config/Constants";

export default class LoginPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password: '',
      },
    };
  }
  
  onKeyPress(event) {
    if (event.key === 'Enter') {
      this.onLoginClick();
    }
  }
  
  onValueChange(event, field) {
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({ user });
  }
  
  onLoginClick() {
    apiFetch('POST', Constants.API_LOGIN, this.state.user)
      .then(data => {
        console.log(data);
        
        const { history } = this.props;
        history.push('/user');
      })
      .catch(error => {
        console.log(error);
        this.setState({
          user: {
            email: '',
            password: '',
          },
        });
      });
  }
  
  render() {
    return (
      <Layout>
        <div className={s.root}>
          <div className={s.container}>
            <input
              className={cx(s.input, s.noOutline)}
              placeholder="Email"
              value={this.state.user.email}
              onKeyPress={event => this.onKeyPress(event)}
              onChange={event => this.onValueChange(event, 'email')}
            />
            <input
              className={cx(s.input, s.noOutline)}
              type="password"
              placeholder="Password"
              value={this.state.user.password}
              onKeyPress={event => this.onKeyPress(event)}
              onChange={event => this.onValueChange(event, 'password')}
            />
            <input
              className={cx(s.button, s.submit, s.noOutline)}
              type="button"
              value="Log in"
              onClick={() => this.onLoginClick()}
            />
          </div>
        </div>
      </Layout>
    );
  }
}
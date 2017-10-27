import React, { Component } from 'react';
import logo from './logo.svg';
import s from './App.css';

class App extends Component {
  render() {
    return (
      <div className={s.App}>
        <header className={s['App-header']}>
          <img src={logo} className={s['App-logo']} alt="logo" />
          <h1 className={s['App-title']}>Welcome to React</h1>
        </header>
        <p className={s['App-intro']}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;

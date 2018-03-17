import React from 'react';
import cx from 'classnames';
import {CSSTransitionGroup} from 'react-transition-group'

import gs from '../global.css';
import s from './ConfirmBox.css';

export default class ConfirmBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillMount() {
    const {onRef, onOkClick} = this.props;
    this.onRef = onRef;
    this.onOkClick = onOkClick;
  }

  componentDidMount() {
    this.onRef(this);
  }

  onOverlayClick() {
    this.setVisible(false);
  }

  onCancelClick() {
    this.setVisible(false);
  }

  setVisible(visible) {
    this.setState({
      visible,
    });
  }

  show(message) {
    this.message = message;
    this.setVisible(true);
  }

  render() {
    const {visible} = this.state;
    return (
      <div>
        <CSSTransitionGroup transitionName="fade"
                            transitionEnterTimeout={100}
                            transitionLeaveTimeout={500}>
          {
            visible ? (
              <div className={s.overlay} onClick={() => this.onOverlayClick()}/>
            ): null
          }
        </CSSTransitionGroup>
        <CSSTransitionGroup transitionName="fade"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={100}>
          { visible ? (
            <div className={cx(gs.adminContainer, s.container)}>
              {this.message}
              <div className={s.buttonContainer}>
                <button
                  className={cx(gs.shadowButton, gs.danger, s.button)}
                  onClick={() => this.onCancelClick()}
                >
                  Cancel
                </button>
                &nbsp;&nbsp;
                <button
                  className={cx(gs.shadowButton, s.button)}
                  onClick={() => this.onOkClick()}
                >
                  OK
                </button>
              </div>
            </div>
          ) : null }
        </CSSTransitionGroup>
      </div>
    );
  }
}
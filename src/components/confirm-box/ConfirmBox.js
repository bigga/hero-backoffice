import React from 'react';
import cx from 'classnames';

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
    const { onRef, onOkClick } = this.props;
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
    return (
      <div className={!this.state.visible ? gs.hidden : null}>
        <div className={s.overlay} onClick={() => this.onOverlayClick()} />
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
      </div>
    );
  }
}
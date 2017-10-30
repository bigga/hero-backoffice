import React from 'react';
import cx from 'classnames';

import gs from '../global.css';
import s from './EditBox.css';

export default class EditBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  
    const { onRef, onOkClick } = this.props;
    this.onRef = onRef;
    this.onOkClick = onOkClick;
  }
  
  componentDidMount() {
    this.onRef(this);
  }
  
  onCancel() {
    const { onCancelClick } = this.props;
    this.setVisible(false);
    if (onCancelClick) {
      onCancelClick();
    }
  }
  
  onOverlayClick() {
    const { loading } = this.props;
    if (loading) return;
    this.onCancel();
  }
  
  onCancelClick() {
    this.onCancel();
  }
  
  setTitle(title) {
    this.setState({
      title,
    });
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
    const { loading, fullPage } = this.props;
    return (
      <div className={!this.state.visible ? gs.hidden : null}>
        <div className={s.overlay} onClick={() => this.onOverlayClick()} />
        <div className={cx(
          gs.adminContainer,
          s.container,
          fullPage ? s.fullPage : null
        )}>
          <div className={s.titleContainer}>{this.state.title}</div>
          <div className={s.contentContainer}>{this.props.children}</div>
          {loading ? (
            <div className={s.contentLoading}>
              <i className="fa fa-cog fa-spin fa-5x fa-fw" />
            </div>
          ) : null}
          { loading ? null : (
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
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
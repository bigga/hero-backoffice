import React from 'react';
import cx from 'classnames';

import gs from '../global.css';
import s from './SearchBox.css';

export default class SearchBox extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  onIconClick() {
    this.searchInput.focus();
  }
  
  onSearchChange(event) {
    const { onSearch } = this.props;
    const text = event.target.value;
    if (!onSearch) {
      return;
    }
    onSearch(text);
  }
  
  render() {
    return (
      <div className={cx(gs.adminContainer, s.container)}>
        <div className={s.icon} onClick={() => this.onIconClick()}>
          <i className="fa fa-search" />
        </div>
        <div className={s.item}>
          <input ref={ref => this.searchInput = ref} type="text"
            onChange={event => this.onSearchChange(event)}/>
        </div>
      </div>
    );
  }
}
import React from 'react';
import cx from 'classnames';

import gs from '../global.css';
import s from './Pagination.css';

export default class Pagination extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { page: 1 };
  }
  
  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
  }
  
  changePage(isNext) {
    const { canMoveNext } = this.props;
    if (isNext && !canMoveNext) {
      return;
    }
    
    const { onPageChange } = this.props;
    const { page } = this.state;
    const newPage = isNext
      ? Math.min(Number.MAX_SAFE_INTEGER, page + 1)
      : Math.max(1, page - 1);
  
    if (!onPageChange) return;
    onPageChange(newPage).then(() => {
      this.setState({page: newPage });
    });
  }
  
  back() {
    this.changePage(false);
  }
  
  next() {
    this.changePage(true);
  }
  
  reset() {
    this.setState({ page: 1 });
  }
  
  render() {
    const { canMoveNext } = this.props;
    const { page } = this.state;
    return (
      <div className={cx(gs.adminContainer, s.container)}>
        <div className={cx(gs.textLeft, s.item, s.symbol)}
             onClick={() => this.back()}>
          { page !== 1 ?
            (
              <i className="fa fa-chevron-left" />
            ) : null }
        </div>
        <div className={cx(gs.textCenter, s.item)}>
          {page}
        </div>
        <div className={cx(gs.textRight, s.item, s.symbol)}
             onClick={() => this.next()}>
          { canMoveNext ?
            (
              <i className="fa fa-chevron-right" />
            ) : null }
        </div>
      </div>
    );
  }
}
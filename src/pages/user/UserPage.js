import React from 'react';
import cx from 'classnames';

import Constants from '../../config/Constants';
import apiFetch from '../../utils/ApiFetch';
import multipartFetch from '../../utils/MultipartFetch';
import Validator from '../../utils/validator';

import Layout from '../../components/layout/Layout';
import Pagination from '../../components/pagination/Pagination';
import EditBox from '../../components/edit-box/EditBox';
import ConfirmBox from '../../components/confirm-box/ConfirmBox';

import gs from '../../components/global.css';
import TextUtils from "../../utils/TextUtils";
import SearchBox from "../../components/search-box/SearchBox";

export default class UserPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.offset = 0;
    this.limit = 10;
    this.state = {
      importing: false,
      items: [],
      importedItems: [],
      roles: [],
      validation: {...this.defaultValidation},
      currentItem: {...this.emptyValue},
      canMoveNext: false,
    };
  }
  
  componentWillMount() {
    apiFetch('GET', Constants.API_ROLE)
      .then(roles => {
        this.setState({ roles })
      });
    apiFetch('GET', `${Constants.API_USER}?offset=0&limit=10`)
      .then(json => this.setState({
        items: json.data,
        canMoveNext: !!json.next
      }));
  }
  
  onPageChange(page) {
    this.offset = (page - 1) * this.limit;
    return this.query();
  }
  
  onSearch(text) {
    this.offset = 0;
    this.pagination.reset();
    this.search = text;
    return this.query();
  }
  
  onItemAdd() {
    this.setState({
      currentItem: { ...this.emptyValue },
      validation: { ...this.defaultValidation },
    });
    this.adminEdit.setTitle(`Add ${this.itemName}`);
    this.adminEdit.setVisible(true);
  }
  
  onItemEdit(item) {
    Promise.resolve()
      .then(() => {
        return apiFetch('GET', `${Constants.API_USER}/${item.id}`)
          .then(json => {
            console.log('>>current_item<<', json);
            const currentItem = json.data || {};
            if (currentItem) {
              currentItem.roleId = currentItem.role_id;
            }
            this.setState({ currentItem });
            return Promise.resolve(currentItem);
          });
      })
      .then(currentItem => {
        this.adminEdit.setTitle(`Edit ${this.itemName}`);
        this.adminEdit.setVisible(true);
      });
  }
  
  onImport() {
    const { importedItems } = this.state;
    this.setState({ importing: true });
    Promise.all((importedItems || [])
      .filter(item => !item.invalid || !item.invalid.length)
      .map(item => {
        return apiFetch('POST', Constants.API_USER, item);
      })
    )
      .then(() => window.location.reload())
      .catch(error => console.log(error));
  }
  
  onExcelImport() {
    this.uploadInput.click();
  }
  
  onUploadChange(event) {
    const excel = event.target.files[0];
    const formData = new FormData();
    formData.append('excel', excel);
    
    this.setState({ importedItems: [] });
    multipartFetch(
      'POST',
      `${Constants.API_USER}/excel`,
      formData
    ).then(importedItems => {
      this.uploadInput.value = null;
      this.setState({ importedItems });
      this.adminImport.setTitle(`Import from Excel`);
      this.adminImport.setVisible(true);
    });
  }
  
  onItemDelete(item) {
    this.setState({
      currentItem: item,
    });
    this.adminConfirm.show(`Are you sure you want to delete "${item.name}"?`);
  }
  
  onItemDeleteConfirm() {
    const { id } = this.state.currentItem;
    apiFetch('DELETE', `${Constants.API_USER}/${id}`)
      .then(user => {
        window.location.reload();
      })
      .catch(error => {
        this.adminConfirm.setVisible(false);
      });
  }
  
  onValueChange(event, field) {
    const item = this.state.currentItem;
    item[field] = event.target.value;
    this.setState({ currentItem: item });
  }
  
  onSave() {
    const { currentItem, validation } = this.state;
    validation.name = !!(currentItem.name || '').trim();
    validation.email = Validator.email.validate(currentItem.email);
    validation.roleId = !!(currentItem.roleId || '').trim();
    this.setState({ validation });
    
    if (!Object.keys(validation).every(key => validation[key])) {
      return;
    }
    
    if (currentItem.id) {
      const {currentItem} = this.state;
      console.log('>>current_item<<', currentItem);
      
      apiFetch('PUT', `${Constants.API_USER}/${currentItem.id}`, currentItem)
        .then(() => {
          window.location.reload();
        })
        .catch(error => {
          const { message } = error;
          if (message.indexOf('@JSON_') === 0) {
            const data = JSON.parse(message.replace('@JSON_', ''));
            const { message: boxError } = data;
            this.setState({ boxError });
          }
        });
    } else {
      apiFetch('POST', Constants.API_USER, this.state.currentItem)
        .then(items => {
          window.location.reload();
        })
        .catch(error => {
          const { message } = error;
          if (message.indexOf('@JSON_') === 0) {
            const data = JSON.parse(message.replace('@JSON_', ''));
            const { message: boxError } = data;
            this.setState({ boxError });
          }
        });
    }
  }
  
  query() {
    let { offset, limit, search } = this;
    offset = offset || '';
    limit = limit || '';
    search = search || '';
    return apiFetch('GET', `${Constants.API_USER}`
      +`?offset=${offset}&limit=${limit}&q=${search}`)
      .then(json => {
        const items = json.data;
        this.setState({ items, canMoveNext: !!json.next });
        return Promise.resolve();
      });
  }
  
  itemName = 'User';
  emptyValue = { id: '', name: '', email: '', roleId: '' };
  defaultValidation = { name: true, email: true, roleId: true };
  
  renderConfirm() {
    return (
      <ConfirmBox
        onRef={ref => (this.adminConfirm = ref)}
        onOkClick={() => this.onItemDeleteConfirm()}
      />
    );
  }
  
  renderImport() {
    const { importedItems } = this.state;
    return (
      <EditBox
        onRef={ref => (this.adminImport = ref)}
        onOkClick={() => this.onImport()}
        loading={this.state.importing}
        fullPage
      >
        <table className={gs.dataTable}>
          <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
          </thead>
          <tbody>
          {(importedItems || []).map((item, index) => (
            <tr key={item.id}>
              <td className={gs.idCell}>
                <i className={
                  item.invalid.indexOf('email') !== -1
                    ? cx('fa fa-times-circle', gs.frontIcon, gs.errorIcon)
                    : cx('fa fa-check-circle', gs.frontIcon, gs.okIcon)
                } />
                {item.email || '—'}
              </td>
              <td className={gs.nameCell}>
                <i className={
                  item.invalid.indexOf('name') !== -1
                    ? cx('fa fa-times-circle', gs.frontIcon, gs.errorIcon)
                    : cx('fa fa-check-circle', gs.frontIcon, gs.okIcon)
                } />
                {item.name || '—'}
              </td>
              <td className={gs.idCell}>
                <i className={
                  item.invalid.indexOf('role') !== -1
                    ? cx('fa fa-times-circle', gs.frontIcon, gs.errorIcon)
                    : cx('fa fa-check-circle', gs.frontIcon, gs.okIcon)
                } />
                {item.role || '—'}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </EditBox>
    );
  }
  
  renderEdit() {
    const { validation } = this.state;
    return (
      <EditBox
        onRef={ref => (this.adminEdit = ref)}
        onOkClick={() => this.onSave()}
      >
        <div className={gs.boxError}>
          { this.state.boxError }
        </div>
        <label
          className={cx(gs.formLabel, !validation.name && gs.error)}
          htmlFor="name"
        >
          Name*
        </label>
        <input
          id="name"
          className={cx(gs.formInput, !validation.name && gs.errorInput)}
          value={this.state.currentItem.name}
          placeholder="Name"
          onChange={event => this.onValueChange(event, 'name')}
        />
        <label
          className={cx(gs.formLabel, !validation.email && gs.error)}
          htmlFor="email"
        >
          Email*
        </label>
        <input
          id="email"
          className={cx(gs.formInput, !validation.email && gs.errorInput)}
          value={this.state.currentItem.email}
          placeholder="Email"
          onChange={event => this.onValueChange(event, 'email')}
        />
        <label
          className={cx(gs.formLabel, !validation.roleId && gs.error)}
          htmlFor="role"
        >
          Role*
        </label>
        <select
          id="role"
          className={cx(gs.formInput, !validation.roleId && gs.errorInput)}
          value={
            this.state.currentItem.roleId
          }
          placeholder="Role"
          onChange={event => this.onValueChange(event, 'roleId')}
        >
          <option value="">Please select</option>
          {(this.state.roles || []).map(role => (
            <option value={role.id}>{TextUtils.capitalize(role.name)}</option>
          ))}
        </select>
      </EditBox>
    );
  }
  
  render() {
    const { items, canMoveNext } = this.state;
    return (
      <Layout loggedIn>
        <div className={gs.adminRoot}>
          <div className={gs.filterPagination}>
            <Pagination onRef={ref => this.pagination = ref}
              onPageChange={page => this.onPageChange(page)}
              canMoveNext={canMoveNext}
            />
            <SearchBox onSearch={text => this.onSearch(text)}/>
          </div>
          <div className={gs.clearFixed}/>
          <div className={gs.adminContainer}>
            <table className={gs.dataTable}>
              <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Registered</th>
                <th>
                  <input type="file" style={{display: 'none'}}
                         ref={ref => this.uploadInput = ref}
                         onChange={event => this.onUploadChange(event)} />
                  <button
                    className={cx(gs.shadowButton, gs.pushRight)}
                    onClick={() => this.onExcelImport()}
                  >
                    Import
                  </button>
                </th>
                <th>
                  <button
                    className={cx(gs.shadowButton, gs.pushRight)}
                    onClick={() => this.onItemAdd()}
                  >
                    New
                  </button>
                </th>
              </tr>
              </thead>
              <tbody>
              {(items || []).map((item, index) => (
                <tr key={item.id}>
                  <td className={gs.idCell}>{item.email}</td>
                  <td className={gs.nameCell}>{item.name}</td>
                  <td className={gs.idCell}>
                    {TextUtils.capitalize(item.role.name)}
                  </td>
                  <td className={gs.idCell}>
                    {item.registered ? 'Yes' : 'No'}
                  </td>
                  <td className={gs.buttonCell}>
                    <button
                      className={gs.shadowButton}
                      onClick={() => this.onItemEdit(item)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className={gs.buttonCell}>
                    <button
                      className={cx(gs.shadowButton, gs.danger)}
                      onClick={() => this.onItemDelete(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          {this.renderConfirm()}
          {this.renderEdit()}
          {this.renderImport()}
        </div>
      </Layout>
    );
  }
}
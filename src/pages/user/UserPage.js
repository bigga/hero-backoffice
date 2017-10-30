import React from 'react';
import cx from 'classnames';

import Constants from '../../config/Constants';
import apiFetch from '../../utils/ApiFetch';
import multipartFetch from '../../utils/MultipartFetch';
import Validator from '../../utils/validator';

import Layout from '../../components/layout/Layout';
import EditBox from '../../components/edit-box/EditBox';
import ConfirmBox from '../../components/confirm-box/ConfirmBox';

import gs from '../../components/global.css';
import TextUtils from "../../utils/TextUtils";

export default class UserPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      importing: false,
      items: [],
      importedItems: [],
      roles: [],
      validation: {...this.defaultValidation},
      currentItem: {...this.emptyValue},
    };
  }
  
  componentWillMount() {
    apiFetch('GET', Constants.API_ROLE)
      .then(roles => {
        this.setState({ roles })
      });
    apiFetch('GET', Constants.API_USER)
      .then(items => this.setState({ items }));
  }
  
  onItemAdd() {
    this.setState({
      currentItem: { ...this.emptyValue },
      validation: { ...this.defaultValidation },
    });
    this.adminEdit.setTitle(`Add ${this.itemName}`);
    this.adminEdit.setVisible(true);
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
    
    // if (currentItem.id) {
    //   axios
    //     .put(`${this.itemApi}${currentItem.id}`, currentItem)
    //     .then(response => {
    //       const json = response.data;
    //       const item = json.data;
    //       console.log(item);
    //       this.adminEdit.setVisible(false);
    //       window.location.reload();
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // } else {
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
    // }
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
          {this.state.roles.map(role => (
            <option value={role.id}>{TextUtils.capitalize(role.name)}</option>
          ))}
        </select>
      </EditBox>
    );
  }
  
  render() {
    const { items } = this.state;
    return (
      <Layout loggedIn={true}>
        <div className={gs.adminRoot}>
          <div className={gs.adminContainer}>
            <table className={gs.dataTable}>
              <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
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
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className={gs.idCell}>{item.email}</td>
                  <td className={gs.nameCell}>{item.name}</td>
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
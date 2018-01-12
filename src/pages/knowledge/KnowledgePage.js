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

export default class KnowledgePage extends React.Component {

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
    apiFetch('GET', `${Constants.API_KNOWLEDGE}`)
      .then(json => this.setState({
        items: json.data,
      }));
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
        return apiFetch('GET', `${Constants.API_KNOWLEDGE}/${item.id}`)
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

  onItemDelete(item) {
    this.setState({
      currentItem: item,
    });
    this.adminConfirm.show(`Are you sure you want to delete "${item.nameTH}"?`);
  }

  onItemDeleteConfirm() {
    const { id } = this.state.currentItem;
    apiFetch('DELETE', `${Constants.API_KNOWLEDGE}/${id}`)
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

  onFileChange(event, field) {
    const item = this.state.currentItem;
    item[field] = [...(event.target.files || [])].shift();
    this.setState({ currentItem: item });
  }

  onSave() {
    const { currentItem, validation } = this.state;
    validation.nameTH = !!(currentItem.nameTH || '').trim();
    validation.nameEN = !!(currentItem.nameEN || '').trim();
    validation.file = currentItem.id ? true : !!currentItem.file;
    this.setState({ validation });

    console.log('>>validation<<', validation);
    if (!Object.keys(validation).every(key => validation[key])) {
      return;
    }
    
    const formData = new FormData();
    formData.append('nameTH', currentItem.nameTH);
    formData.append('nameEN', currentItem.nameEN);
    formData.append('file', currentItem.file);

    if (currentItem.id) {
      const {currentItem} = this.state;
      console.log('>>current_item<<', currentItem);

      apiFetch('PUT', `${Constants.API_KNOWLEDGE}/${currentItem.id}`, formData)
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
      apiFetch('POST', Constants.API_KNOWLEDGE, formData)
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

  itemName = 'Knowledge';
  emptyValue = { id: '', nameEN: '', nameTH: '', file: '' };
  defaultValidation = { nameEN: true, nameTH: true, file: true };

  renderConfirm() {
    return (
      <ConfirmBox
        onRef={ref => (this.adminConfirm = ref)}
        onOkClick={() => this.onItemDeleteConfirm()}
      />
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
          className={cx(gs.formLabel, !validation.nameTH && gs.error)}
          htmlFor="nameTH"
        >
          Thai name*
        </label>
        <input
          id="nameTH"
          className={cx(gs.formInput, !validation.nameTH && gs.errorInput)}
          value={this.state.currentItem.nameTH}
          placeholder="Thai name"
          onChange={event => this.onValueChange(event, 'nameTH')}
        />
        <label
          className={cx(gs.formLabel, !validation.nameEN && gs.error)}
          htmlFor="nameEN"
        >
          English name*
        </label>
        <input
          id="nameEN"
          className={cx(gs.formInput, !validation.nameEN && gs.errorInput)}
          value={this.state.currentItem.nameEN}
          placeholder="English name"
          onChange={event => this.onValueChange(event, 'nameEN')}
        />
        <label
          className={cx(gs.formLabel, !validation.file && gs.error)}
          htmlFor="file"
        >
          Document file*
        </label>
        <input type="file"
          id="file"
          className={cx(gs.formInput, !validation.file && gs.errorInput)}
          placeholder="File"
          onChange={event => this.onFileChange(event, 'file')}
        />
      </EditBox>
    );
  }

  render() {
    const { items } = this.state;
    return (
      <Layout loggedIn>
        <div className={gs.adminRoot}>
          <div className={gs.clearFixed}/>
          <div className={gs.adminContainer}>
            <table className={gs.dataTable}>
              <thead>
              <tr>
                <th>Thai Name</th>
                <th>English Name</th>
                <th>URL</th>
                <th>
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
                  <td className={gs.nameCell}>{item.nameTH}</td>
                  <td className={gs.idCell}>{item.nameEN}</td>
                  <td className={cx(gs.idCell, gs.small)}>
                    {`https://s3-ap-southeast-1.amazonaws.com/heroapp-knowledge/${item.url}`}
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
        </div>
      </Layout>
    );
  }
}
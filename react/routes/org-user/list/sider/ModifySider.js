import React, {
  useContext, useState, use, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Action, Content, axios, Page, Permission, Breadcrumb, TabPage,
} from '@choerodon/boot';
import { findIndex } from 'lodash';
import {
  Form, TextField, Password, Select, EmailField, SelectBox,
} from 'choerodon-ui/pro';
import Store from './stores';
import './index.less';

const { Option } = Select;
export default observer((props) => {
  const {
    prefixCls, intlPrefix, modal, orgUserListDataSet, onOk, orgAllRoleDataSet, orgRoleDataSet,
  } = useContext(Store);

  useEffect(() => {
    orgUserListDataSet?.getField('userLabels')?.options?.query();
  }, []);

  function handleCancel() {
    orgUserListDataSet.reset();
  }

  async function handleOk() {
    if (!orgUserListDataSet.current.dirty && !orgUserListDataSet.current.get('dirty')) {
      return true;
    }
    if (await orgUserListDataSet.submit()) {
      await orgUserListDataSet.reset();
      await onOk();
      return true;
    }
    return false;
  }

  modal.handleOk(handleOk);
  modal.handleCancel(handleCancel);

  const handleInput = (e) => {
    const optionDs = orgUserListDataSet?.getField('userLabels').options;
    optionDs.forEach((record) => {
      if (record.get('status') === 'local' && !record.isSelected) {
        optionDs.remove(record);
      }
    });
    const arr = orgUserListDataSet?.getField('userLabels').options.toData();
    if (findIndex(arr, (i) => i.name === e.target.value) === -1 && e.target.value) {
      arr.unshift({
        name: e.target.value,
        status: 'local',
      });
    }

    orgUserListDataSet?.getField('userLabels').options.loadData(arr);
  };

  return (
    <div
      className={`${prefixCls}-modal`}
    >
      <Form dataSet={orgUserListDataSet}>
        <TextField name="realName" />
        <EmailField name="email" />
        <TextField name="phone" />
        <Select value="zh_CN" label="语言">
          <Option value="zh_CN">简体中文</Option>
        </Select>
        <Select value="CTT" label="时区">
          <Option value="CTT">中国</Option>
        </Select>
        <Select
          multiple
          name="userLabels"
          searchable
          onInput={(e) => { handleInput(e); }}
          className="userLabels-select"
        />
        <Select
          multiple
          name="roles"
          options={orgRoleDataSet}
        />
      </Form>
    </div>
  );
});

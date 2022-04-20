import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Action, Content, axios, Page, Permission, Breadcrumb, Choerodon,
} from '@choerodon/boot';
import {
  Form, Modal, TextField, Select, EmailField,
} from 'choerodon-ui/pro';
import Store from './stores';
import FormSelectEditor from '../../../../components/formSelectEditor';
import './index.less';

const { Option } = Select;

export default observer((props) => {
  const {
    prefixCls, modal, orgUserRoleDataSet, onOk, organizationId, orgRoleDataSet,
    orgAllRoleDataSet, orgUserListDataSet,
  } = useContext(Store);
  const { current } = orgUserRoleDataSet;
  function handleCancel() {
    orgUserRoleDataSet.reset();
  }
  // eslint-disable-next-line consistent-return
  async function handleOk() {
    const requestData = current.toJSONData();
    requestData.roles = requestData.roles.filter((v) => v).map((v) => ({ id: v }));
    // if (requestData.roles.length === 0) return false;
    const result = await axios.put(`/iam/choerodon/v1/organizations/${organizationId}/users/${current.toData().id}/assign_roles`, requestData.roles);
    if (!result.failed) {
      await orgUserRoleDataSet.reset();
      await onOk();
    } else {
      Choerodon.prompt(result.message);
      return false;
    }
  }

  modal.handleOk(handleOk);
  modal.handleCancel(handleCancel);

  function renderOption({ text, value }) {
    const result = orgAllRoleDataSet.find((item) => item.get('id') === value);
    if (!result) {
      return `${value}`;
    }
    if (!result.get('enabled')) {
      return `${result && result.get('name')}（已停用）`;
    }
    return result && result.get('name');
  }

  const handleInput = (e) => {
    const optionDs = orgUserListDataSet?.getField('userLabels').options;
    optionDs.forEach((record) => {
      if (record.get('status') === 'local' && !record.isSelected) {
        optionDs.remove(record);
      }
    });
    const arr = orgUserListDataSet?.getField('userLabels').options.toData();
    arr.unshift({
      name: e.target.value,
      status: 'local',
    });
    orgUserListDataSet?.getField('userLabels').options.loadData(arr);
  };

  return (
    <div className={`${prefixCls}-modal`}>
      <Form dataSet={orgUserListDataSet}>
        <TextField name="realName" disabled />
        <EmailField name="email" disabled />
        <TextField name="phone" disabled />
        <Select value="zh_CN" label="语言" disabled>
          <Option value="zh_CN">简体中文</Option>
        </Select>
        <Select value="CTT" label="时区" disabled>
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

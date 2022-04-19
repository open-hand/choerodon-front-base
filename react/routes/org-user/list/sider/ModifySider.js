import React, {
  useContext, useState, use, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Action, Content, axios, Page, Permission, Breadcrumb, TabPage,
} from '@choerodon/boot';
import {
  Form, TextField, Password, Select, EmailField, SelectBox,
} from 'choerodon-ui/pro';
import Store from './stores';
import './index.less';
import FormSelectEditor from '../../../../components/formSelectEditor';

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

  const renderOption = ({ text, value }) => {
    const result = orgAllRoleDataSet.find((item) => item.get('id') === value);
    if (!result) {
      return `${value}`;
    }
    if (!result.get('enabled')) {
      return `${result && result.get('name')}（已停用）`;
    }
    return result && result.get('name');
  };

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

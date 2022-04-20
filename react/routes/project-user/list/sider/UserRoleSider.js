/* eslint-disable */
import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  axios, Choerodon,
} from '@choerodon/boot';
import {
  Form, TextField, Select, EmailField, DatePicker , SelectBox
} from 'choerodon-ui/pro';
import some from 'lodash/some';
import Store from './stores';
import './index.less';

const { Option } = Select;

// eslint-disable-next-line no-undef
const hasBusiness = C7NHasModule('@choerodon/base-business');

export default observer((props) => {
  const {
    prefixCls,
    modal,
    intl,
    orgUserRoleDataSet,
    onOk,
    projectId,
    allRoleDataSet,
    orgRoleDataSet,
    orgUserListDataSet,
    AppState,
  } = useContext(Store);
  const { current } = orgUserRoleDataSet;

  const [hasOwner, setHasOwner] = useState(false);
  const [deleteRoleRecord, setDeleteRoleRecord] = useState(undefined);

  useEffect(() => {
    setHasOwner(current.get('roles').some((r) => r === 9));
    orgUserListDataSet.current = orgUserListDataSet.records.find((i) => i.get('id') === current.get('id'));
  }, []);

  function handleCancel() {
    orgUserRoleDataSet.reset();
  }

  const handleDeleteRoleRecord = async (isDelete) => {
    if (isDelete) {
      const requestData = current.toJSONData();
      requestData.roles = requestData.roles.filter((v) => v);
      // if (requestData.roles.length === 0) return false;
      const result = await axios.put(`/iam/choerodon/v1/projects/${projectId}/users/${current.toData().id}/assign_roles`, requestData.roles);
      if (!result.failed) {
        await orgUserRoleDataSet.reset();
        await onOk();
        setDeleteRoleRecord(undefined);
        modal.close();
      } else {
        Choerodon.prompt(result.message);
        return false;
      }
    } else {
      setDeleteRoleRecord(undefined);
    }
  };

  async function handleOk() {
    const { categories } = AppState?.currentMenuType || {};
    if (hasBusiness && some(categories || [], ['code', 'N_PROGRAM']) && current.get('roles') && !current.get('roles').length) {
      await setDeleteRoleRecord(current);
      return false;
    }
    await handleDeleteRoleRecord(true);
  }

  modal.handleOk(handleOk);
  modal.handleCancel(handleCancel);

  return (
    <div className={`${prefixCls}-modal`}>
      <Form  dataSet={orgUserListDataSet} columns={2}>
        <TextField name="realName" disabled colSpan={2}/>
        <EmailField name="email" disabled colSpan={2}/>
        <Select
          multiple
          name="roles"
          options={orgRoleDataSet}
          colSpan={2}
        />
        <TextField name="phone" disabled colSpan={2}/>
        <Select value="zh_CN" label="语言" disabled colSpan={2}>
          <Option value="zh_CN">简体中文</Option>
        </Select>
        <Select value="CTT" label="时区" disabled colSpan={2}>
          <Option value="CTT">中国</Option>
        </Select>
        <DatePicker name='scheduleEntryTime' colSpan={1} style={{width:165}}/>
        <DatePicker name='scheduleExitTime' colSpan={1} style={{width:165,position:'relative',left:6}}/>
        <TextField name="workingGroup" disabled colSpan={2}/>
        <Select
          multiple
          name="userLabels"
          searchable
          colSpan={2}
          disabled
        />
      </Form>
    </div>
  );
});

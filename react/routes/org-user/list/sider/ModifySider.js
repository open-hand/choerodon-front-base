import React, {
  useContext, useState, useMemo, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { findIndex } from 'lodash';
import {
  Form, TextField, Select, EmailField, DataSet,
} from 'choerodon-ui/pro';
import OrgUserListDataSet from '../stores/OrgUserListDataSet';
import Store from './stores';
import './index.less';

const { Option } = Select;
export default observer((props) => {
  const {
    prefixCls, intlPrefix, modal, orgUserListDataSet, onOk, orgAllRoleDataSet, orgRoleDataSet, id,
    formatProjectUser, orgUserRoleDataSet, formatCommon, statusOptionDs, safeOptionDs,
    organizationId,
  } = useContext(Store);

  const formDs = useMemo(() => {
    const ds = new DataSet(OrgUserListDataSet({
      id: organizationId,
      formatProjectUser,
      formatCommon,
      statusOptionDs,
      safeOptionDs,
      orgRoleDataSet,
      orgID: organizationId,
    }));
    ds.getField('roles').set('required', false);
    ds.loadData([orgUserRoleDataSet.current]);
    ds?.getField('userLabels')?.options?.query();

    ds.current.set('roles', ds.current.get('roles').map((item) => item.id));

    return ds;
  }, []);

  function handleCancel() {
    orgUserRoleDataSet.reset();
  }

  async function handleOk() {
    // if (!orgUserListDataSet.current.dirty && !orgUserListDataSet.current.get('dirty')) {
    //   return true;
    // }
    const validateRes = await formDs.validate();

    if (validateRes) {
      try {
        await formDs.submit();
        await orgUserRoleDataSet.reset();
        await onOk();
        return true;
      } catch (error) {
        console.log(error);
      }
    }
    return false;
  }

  modal.handleOk(handleOk);
  modal.handleCancel(handleCancel);

  return (
    <div
      className={`${prefixCls}-modal`}
    >
      <Form dataSet={formDs}>
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
          className="userLabels-select"
          combo
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

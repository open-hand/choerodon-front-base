/* eslint-disable */
import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Action, Content, axios, Page, Permission, Breadcrumb, TabPage, Choerodon,
} from '@choerodon/boot';
import {
  Form, Modal, TextField, Select, EmailField,
} from 'choerodon-ui/pro';
import some from 'lodash/some';
import Store from './stores';
import FormSelectEditor from '../../../../components/formSelectEditor';
import DeleteRoleModal from '../../DeleteRoleModal';
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

  function renderOption({ text, value }) {
    const result = allRoleDataSet.find((item) => item.get('id') === value);
    if (!result) {
      return `${value}`;
    }
    if (!result.get('enabled')) {
      return `${result && result.get('name')}（已停用）`;
    }
    return result && result.get('name');
  }

  /*
     如果是项目群成员 并且角色是项目成员 则不让修改和删除
   */
  function checkItemDisabled(userDataSet, v, optionsDataSet) {
    const projectOwner = userDataSet.current.get('programOwner')
    const value = v;
    const options = optionsDataSet;
    let itemDisabled = false;
    if (projectOwner) {
      if (value) {
        const item = options.records.find(i => String(i.get('id')) === String(value));
        if (item) {
          const isProjectMember = item.get('code') === 'project-member';
          itemDisabled = isProjectMember;
        }
      }
    }
    return itemDisabled;
  }

  return (
    <div className={`${prefixCls}-modal`}>
      <Form disabled dataSet={orgUserListDataSet}>
        <TextField name="realName" />
        <EmailField name="email" />
        <TextField name="phone" />
        <Select value="zh_CN" label="语言">
          <Option value="zh_CN">简体中文</Option>
        </Select>
        <Select value="CTT" label="时区">
          <Option value="CTT">中国</Option>
        </Select>
      </Form>
      <DeleteRoleModal
        deleteRoleRecord={deleteRoleRecord}
        handleCancel={handleDeleteRoleRecord}
        projectId={projectId}
      />
      <FormSelectEditor
        record={orgUserRoleDataSet.current}
        optionDataSet={orgRoleDataSet}
        name="roles"
        addButton="添加其他角色"
        maxDisable
        allRoleDataSet={allRoleDataSet}
        orgUserListDataSet={orgUserListDataSet}
        itemDisabledFunc={checkItemDisabled}
      >
        {((itemProps) => {
          const { value, options } = itemProps;
          const result = allRoleDataSet.find((item) => item.get('id') === itemProps.value);
          const itemDisabled = checkItemDisabled(orgUserListDataSet, value, options);
          return (
            <Select
              {...itemProps}
              labelLayout="float"
              renderer={renderOption}
              disabled={itemDisabled || itemProps.disabled || (result && !result.get('enabled'))}
              style={{ width: '100%' }}
            />
          );
        })}
      </FormSelectEditor>

    </div>
  );
});

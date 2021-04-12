import React, {
  useContext, useEffect, useMemo,
} from 'react';
import { observer } from 'mobx-react-lite';
import NewTips from '@/components/new-tips';
import {
  Form, TextField, Password, Select,
} from 'choerodon-ui/pro';
import Store from './stores';
import FormSelectEditor from '../../../../components/formSelectEditor';

import './index.less';

// eslint-disable-next-line no-undef
const hasRegister = C7NHasModule('@choerodon/base-pro');

export default observer(() => {
  const {
    prefixCls,
    modal,
    orgUserListDataSet,
    orgUserCreateDataSet,
    organizationId,
    orgRoleDataSet,
    onOk,
    userStore,
  } = useContext(Store);
  const addonAfterObj = useMemo(() => ({
    suffix: userStore.getEmailSuffix || undefined,
  }), [userStore.getEmailSuffix]);

  useEffect(() => {
    if (hasRegister) {
      userStore.loadEmailSuffix(organizationId);
    }
    return () => {
      userStore.setEmailSuffix(null);
    };
  }, []);

  async function handleOk() {
    try {
      if (await orgUserCreateDataSet.submit()) {
        orgUserCreateDataSet.reset();
        onOk();
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  modal.handleOk(() => handleOk());
  modal.handleCancel(() => {
    orgUserCreateDataSet.reset();
  });

  return (
    <div className={`${prefixCls}-modal`}>
      <Form dataSet={orgUserCreateDataSet} className="hidden-password">
        <input type="password" style={{ position: 'absolute', top: '-999px' }} />
        <TextField name="realName" />
        <TextField
          name="email"
          addonAfter={<NewTips helpText="此处填入的邮箱，将作为用户的登录名。" />}
          className={`${prefixCls}-modal-email`}
          {...addonAfterObj}
        />
        <Password name="password" />
      </Form>
      <FormSelectEditor
        record={orgUserCreateDataSet.current}
        optionDataSet={orgRoleDataSet}
        name="roles"
        addButton="添加其他角色"
        alwaysRequired
        canDeleteAll={false}
        maxDisable
      >
        {((itemProps) => (
          <Select
            {...itemProps}
            labelLayout="float"
            style={{ width: '100%' }}
          />
        ))}
      </FormSelectEditor>
    </div>
  );
});

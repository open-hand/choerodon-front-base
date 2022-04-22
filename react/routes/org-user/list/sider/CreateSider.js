import React, { useContext, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, TextField, Password, Select,
} from 'choerodon-ui/pro';
import { findIndex } from 'lodash';
import NewTips from '@/components/new-tips';
import Store from './stores';

import './index.less';

// eslint-disable-next-line no-undef
const hasRegister = C7NHasModule('@choerodon/base-pro');

const { Option } = Select;

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
    password,
  } = useContext(Store);

  const addonAfterObj = useMemo(
    () => ({
      suffix: userStore.getEmailSuffix || undefined,
    }),
    [userStore.getEmailSuffix],
  );

  useEffect(() => {
    orgUserCreateDataSet?.getField('userLabels')?.options?.query();
    if (hasRegister) {
      userStore.loadEmailSuffix(organizationId);
    }
    return () => {
      userStore.setEmailSuffix(null);
    };
  }, []);

  async function handleOk() {
    // if (orgUserCreateDataSet.current.get('password') === undefined) {
    //   orgUserCreateDataSet.current.set('password', '');
    // }
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
    return true;
  }

  modal.handleOk(() => handleOk());
  modal.handleCancel(() => {
    orgUserCreateDataSet.reset();
  });

  const handleInput = (e) => {
    const optionDs = orgUserCreateDataSet?.getField('userLabels').options;
    optionDs.forEach((record) => {
      if (record.get('status') === 'local' && !record.isSelected) {
        optionDs.remove(record);
      }
    });
    const arr = orgUserCreateDataSet?.getField('userLabels').options.toData();
    if (findIndex(arr, (i) => i.name === e.target.value) === -1 && e.target.value) {
      arr.unshift({
        name: e.target.value,
        status: 'local',
      });
    }

    orgUserCreateDataSet?.getField('userLabels').options.loadData(arr);
  };

  return (
    <div className={`${prefixCls}-modal`}>
      <Form dataSet={orgUserCreateDataSet} className="hidden-password">
        <input autoComplete="new-password" type="password" style={{ position: 'absolute', top: '-999px' }} />
        <TextField name="realName" />
        <TextField
          name="email"
          addonAfter={<NewTips helpText="此处填入的邮箱，将作为用户的登录名。" />}
          className={`${prefixCls}-modal-email`}
          {...addonAfterObj}
        />
        <Password name="password" addonAfter={<NewTips helpText="不输入密码则使用默认密码。" />} />
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

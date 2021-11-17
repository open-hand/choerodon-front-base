/* eslint-disable */
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, Button, Select, TextField, Icon,
} from 'choerodon-ui/pro';
import { Divider } from 'choerodon-ui';
import Store from './stores';
import FormSelectEditor from '@/components/formSelectEditor';

import './index.less';

export default observer((props) => {
  const {
    prefixCls, modal, onOk, projectId, allRoleDataSet, orgRoleDataSet, inviteUserDataSet, orgInfoDataSet,
  } = useContext(Store);
  const addonAfterObj = {
    addonAfter: (orgInfoDataSet.current && orgInfoDataSet.current.get('emailSuffix') && `${orgInfoDataSet.current.get('emailSuffix')}`) || undefined,
  };
  function handleCancel() {
    inviteUserDataSet.reset();
  }
  async function handleOk() {
    try {
      if (await inviteUserDataSet.submit()) {
        inviteUserDataSet.reset();
        await onOk();
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
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

  return (
    <div className={`${prefixCls}-invite-modal`}>
      {
        inviteUserDataSet.created.map((record) => (
          <>
            <div className={`${prefixCls}-modal`}>
              <Form columns={12} record={record}>
                <TextField {...addonAfterObj} colSpan={11} name="email" />
                {inviteUserDataSet.created.length > 1
                && <Button colSpan={1} onClick={() => inviteUserDataSet.remove(record)}><Icon type="delete_forever" /></Button>}
              </Form>
              <FormSelectEditor
                record={record}
                optionDataSet={orgRoleDataSet}
                name="roleId"
                addButton="添加角色"
                alwaysRequired
                maxDisable
                canDeleteAll={false}
                required
              >
                {((itemProps) => {
                  const result = allRoleDataSet.find((item) => item.get('id') === itemProps.value);
                  return (
                    <Select
                      {...itemProps}
                      labelLayout="float"
                      renderer={renderOption}
                      disabled={result && !result.get('enabled')}
                      style={{ width: '100%' }}
                    />
                  );
                })}
              </FormSelectEditor>
            </div>
            <Divider />
          </>
        ))
      }
      <Button
        icon="add"
        funcType="flat"
        disabled={inviteUserDataSet.created.some((r) => !r.get('email') || !r.get('roleId')[0])}
        onClick={() => inviteUserDataSet.create({ roleId: [''] })}
      >
        邀请成员
      </Button>
    </div>
  );
});

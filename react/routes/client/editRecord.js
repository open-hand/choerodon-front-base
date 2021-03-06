import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import {
  NumberField, Form, SelectBox, TextArea, TextField, Password, Tooltip, Icon,
} from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import forEach from 'lodash/forEach';
import { Choerodon } from '@choerodon/boot';

import './index.less';

const { Option } = SelectBox;

export default inject('AppState')(observer(({
  dataSet, onOk, onCancel, clientStore, AppState, record, isProject, projectId, modal,
}) => {
  const { current } = dataSet;
  const { currentMenuType: { organizationId } } = AppState;

  useEffect(() => {
    async function getClientDetail() {
      try {
        const res = await clientStore.loadClientDetail(organizationId, record.get('id'), isProject, projectId);
        if (res) {
          forEach(res, (value, key) => {
            if (key !== 'authorizedGrantTypes' && (key !== 'scope' || value)) {
              record.init(key, value);
            }
          });
        }
      } catch (e) {
        Choerodon.handleResponseError(e);
      }
    }
    getClientDetail();
  }, []);

  modal.handleOk(handleOk);
  modal.handleCancel(handleCancel);

  function handleCancel() {
    record.reset();
    dataSet.reset();
  }
  async function handleOk() {
    if (!current.dirty) {
      return true;
    }
    try {
      if (await dataSet.submit()) {
        await dataSet.query();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return (
    <div>
      <Form className="hidden-password" dataSet={dataSet}>
        <TextField name="name" style={{ marginTop: 15 }} disabled />
        <Password name="secret" />
        <SelectBox name="authorizedGrantTypes">
          <Option value="password">password</Option>
          <Option value="implicit">implicit</Option>
          <Option value="client_credentials">client_credentials</Option>
          <Option value="authorization_code">authorization_code</Option>
          <Option value="refresh_token">refresh_token</Option>
        </SelectBox>
        <TextField name="webServerRedirectUri" />
        <NumberField name="accessTokenValidity" suffix="秒" />
        <NumberField name="refreshTokenValidity" suffix="秒" />
        <TextField name="scope" showHelp="tooltip" />
        <TextField name="autoApprove" showHelp="tooltip" />
        <TextArea name="additionalInformation" resize="vertical" />
      </Form>
      <div className="organization-pwdpolicy-label">
        <span className="organization-pwdpolicy-label-span">是否进行加密</span>
        <Tooltip title="用此客户端调用接口查询，返回结果是否进行主键加密" placement="top">
          <Icon type="help" />
        </Tooltip>
      </div>
      <Form dataSet={dataSet}>
        <SelectBox name="apiEncryptFlag">
          <Option value={1}>
            <span className="organization-pwdpolicy-box-span">是</span>
          </Option>
          <Option value={0}>
            <span className="organization-pwdpolicy-box-span">否</span>
          </Option>
        </SelectBox>
      </Form>
    </div>
  );
}));

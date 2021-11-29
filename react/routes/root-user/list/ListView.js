/* eslint-disable react/jsx-no-bind */
import React, { useContext, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Action, Content, Header, axios, Permission, Breadcrumb, Page, HeaderButtons,
} from '@choerodon/boot';
import { Button, Modal as OldModal } from 'choerodon-ui';
import { Table, Modal } from 'choerodon-ui/pro';
import { useFormatMessage } from '@choerodon/master';
import Store from './stores';
import Sider from './sider';
import './index.less';

const { Column } = Table;
export default function ListView() {
  const context = useContext(Store);
  const {
    intlPrefix, permissions, intl, adminListDataSet, adminCreateDataSet, prefixCls,
  } = context;
  const format = useFormatMessage(intlPrefix);
  async function handleDelete({ record }) {
    Modal.open({
      title: format({ id: 'deleteRootUser' }),
      children: format({ id: 'confirm.deleteRootUser' }, { name: record.get('realName') }),
      onOk: async () => {
        try {
          await axios.delete(`/iam/choerodon/v1/users/admin/${record.get('id')}`);
          return await adminListDataSet.query();
        } catch (e) {
          return false;
        }
      },
    });
  }
  function renderAction(record) {
    const actionDatas = [{
      service: ['choerodon.code.site.manager.root-user.ps.delete'],
      text: <FormattedMessage id={`${intlPrefix}.action.delete`} />,
      action: () => handleDelete(record),
    }];
    return <Action data={actionDatas} />;
  }
  function handleCreate() {
    adminCreateDataSet.create({ userName: [''] });
    Modal.open({
      title: intl.formatMessage({ id: 'global.root-user.sider.title' }),
      drawer: true,
      style: { width: '3.8rem', padding: '0' },
      children: <Sider
        adminCreateDataSet={adminCreateDataSet}
        adminListDataSet={adminListDataSet}
      />,
      className: 'base-root-user-sider-modal',
      afterClose: () => {
        adminCreateDataSet.reset();
      },
    });
  }

  return (
    <Page
      service={permissions}
    >
      <Header
        title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
      >
        <HeaderButtons
          items={([{
            name: <FormattedMessage id={`${intlPrefix}.button.add`} />,
            icon: 'playlist_add',
            display: true,
            permissions: ['choerodon.code.site.manager.root-user.ps.add'],
            handler: handleCreate,
          }])}
          showClassName={false}
        />
      </Header>
      <Breadcrumb />
      <Content>
        <Table pristine dataSet={adminListDataSet}>
          <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="realName" />
          <Column renderer={renderAction} width={60} align="right" />
          <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="loginName" />
        </Table>
      </Content>
    </Page>
  );
}

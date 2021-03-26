import React, { useContext, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  Action, Content, Header, axios, Permission, Breadcrumb, Page,
} from '@choerodon/boot';
import { Button, Modal as OldModal } from 'choerodon-ui';
import { Table, Modal } from 'choerodon-ui/pro';
import Store from './stores';
import Sider from './sider';
import './index.less';

const { Column } = Table;
export default function ListView() {
  const context = useContext(Store);
  const {
    intlPrefix, permissions, intl, adminListDataSet, adminCreateDataSet, prefixCls,
  } = context;
  async function handleDelete({ record }) {
    OldModal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: '删除root用户',
      content: `确认删除root用户"${record.get('realName')}"吗?`,
      onOk: async () => {
        try {
          await axios.delete(`/iam/choerodon/v1/users/admin/${record.get('id')}`);
          await adminListDataSet.query();
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
        <Permission service={['choerodon.code.site.manager.root-user.ps.add']}>
          <Button icon="playlist_add" onClick={handleCreate}><FormattedMessage id={`${intlPrefix}.button.add`} /></Button>
        </Permission>
      </Header>
      <Breadcrumb />
      <Content className="c7ncd-page-content-padding">
        <Table pristine dataSet={adminListDataSet}>
          <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="realName" />
          <Column renderer={renderAction} width={50} align="right" />
          <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="loginName" />
        </Table>
      </Content>
    </Page>
  );
}

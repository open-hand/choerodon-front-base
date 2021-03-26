import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Action, Content, Header, axios, Permission, Breadcrumb, Page,
} from '@choerodon/boot';
import { Button, Modal as OldModal } from 'choerodon-ui';
import { Table, message, Modal } from 'choerodon-ui/pro';
import Store from './stores';
import Sider from './sider';
import './index.less';

const modalKey = Modal.key();

const { Column } = Table;
export default function ListView() {
  const {
    intlPrefix, permissions, intl, orgAdminListDataSet: dataSet,
    orgAdminCreateDataSet, organizationId,
  } = useContext(Store);

  async function handleDelete({ record }) {
    OldModal.confirm({
      className: 'c7n-iam-confirm-modal',
      title: '确认删除组织管理员',
      content: `确认删除组织管理员"${record.get('userName')}"吗？`,
      onOk: async () => {
        try {
          const result = await axios.delete(`/iam/choerodon/v1/organizations/${organizationId}/org_administrator/${record.get('id')}`);
          if (result.failed) {
            throw result.message;
          }
        } catch (err) {
          message.error(err);
        } finally {
          dataSet.query();
        }
      },
    });
  }

  function renderAction(record) {
    const actionDatas = [{
      service: ['choerodon.code.organization.manager.organization-admin.ps.delete'],
      text: <FormattedMessage id={`${intlPrefix}.action.delete`} />,
      action: () => handleDelete(record),
    }];
    return <Action data={actionDatas} />;
  }

  function handleCreate() {
    orgAdminCreateDataSet.create({ userName: [''] });
    Modal.open({
      title: intl.formatMessage({ id: 'organization.admin.sider.title' }),
      key: modalKey,
      drawer: true,
      style: {
        width: '26.39%',
      },
      children: (
        <Sider
          orgAdminCreateDataSet={orgAdminCreateDataSet}
          orgAdminListDataSet={dataSet}
        />
      ),
      okText: '保存',
      afterClose: () => orgAdminCreateDataSet.reset(),
    });
  }

  function renderUserName({ value, record }) {
    if (record.get('externalUser')) {
      return (
        <span>
          <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{value}</span>
          <div className="base-org-admin-external-user">
            <span className="base-org-admin-external-user-text">
              外部人员
            </span>
          </div>
        </span>
      );
    }
    return <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{value}</span>;
  }
  return (
    <Page
      service={permissions}
    >
      <Header
        title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
      >
        <Permission service={['choerodon.code.organization.manager.organization-admin.ps.add']}>
          <Button icon="playlist_add" onClick={handleCreate}><FormattedMessage id={`${intlPrefix}.button.add`} /></Button>
        </Permission>
      </Header>
      <Breadcrumb />
      <Content className="c7ncd-page-content-padding">
        <Table pristine dataSet={dataSet}>
          <Column renderer={renderUserName} name="userName" />
          <Column renderer={renderAction} width={50} align="right" />
          <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="loginName" />
          <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="creationDate" />
        </Table>
      </Content>
    </Page>
  );
}

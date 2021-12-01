import React, { useContext } from 'react';
import {
  Action, Content, Header, axios, Breadcrumb, Page, HeaderButtons,
} from '@choerodon/boot';
import { Table, message, Modal } from 'choerodon-ui/pro';
import Store from './stores';
import Sider from './sider';
import './index.less';

const modalKey = Modal.key();

const { Column } = Table;
export default function ListView() {
  const {
    formatClient, formatCommon, permissions, orgAdminListDataSet: dataSet,
    orgAdminCreateDataSet, organizationId,
  } = useContext(Store);

  async function handleDelete({ record }) {
    Modal.open({
      key: Modal.key(),
      title: '确认删除组织管理员',
      children: `确认删除组织管理员"${record.get('userName')}"吗？`,
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

  const renderAction = (record) => {
    const actionDatas = [{
      service: ['choerodon.code.organization.manager.organization-admin.ps.delete'],
      text: formatCommon({ id: 'delete' }),
      action: () => handleDelete(record),
    }];
    return <Action data={actionDatas} />;
  };

  function handleCreate() {
    orgAdminCreateDataSet.create({ userName: [''] });
    Modal.open({
      title: formatClient({ id: 'addOrganizationAdministrator' }),
      key: modalKey,
      drawer: true,
      style: {
        width: '26.39%',
      },
      children: (
        <Sider
          orgAdminCreateDataSet={orgAdminCreateDataSet}
          orgAdminListDataSet={dataSet}
          formatClient={formatClient}
        />
      ),
      okText: '保存',
      afterClose: () => orgAdminCreateDataSet.reset(),
    });
  }

  const renderUserName = ({ value, record }) => {
    if (record.get('externalUser')) {
      return (
        <span>
          <span>{value}</span>
          <div className="base-org-admin-external-user">
            <span className="base-org-admin-external-user-text">
              {formatClient({ id: 'outer' })}
            </span>
          </div>
        </span>
      );
    }
    return <span>{value}</span>;
  };
  return (
    <Page
      service={permissions}
    >
      <Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: formatClient({ id: 'addOrganizationAdministrator' }),
            icon: 'playlist_add',
            display: true,
            permissions: ['choerodon.code.organization.manager.organization-admin.ps.add'],
            handler: handleCreate,
          }])}
        />
      </Header>
      <Breadcrumb />
      <Content>
        <Table pristine dataSet={dataSet}>
          <Column renderer={renderUserName} name="userName" />
          <Column renderer={renderAction} width={60} align="right" />
          <Column name="loginName" />
          <Column name="creationDate" />
        </Table>
      </Content>
    </Page>
  );
}

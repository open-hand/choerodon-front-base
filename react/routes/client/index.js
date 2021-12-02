import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table, message, Modal,
} from 'choerodon-ui/pro';
import {
  Content, Header, Page, axios, Action, Permission, Breadcrumb, HeaderButtons,
} from '@choerodon/boot';

import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Store, { StoreProvider } from './store';

import EditRecord from './editRecord';
import CreateRecord from './createRecord';
import EditRole from './editRole';

const { Column } = Table;
const createKey = Modal.key();
const editKey = Modal.key();
const roleKey = Modal.key();

const Client = withRouter(observer(() => {
  const {
    clientDataSet, optionsDataSet, orgId, clientStore, isProject, projectId,
    formatCommon,
    formatClient,
  } = useContext(Store);

  function openEditRecordModal(record) {
    clientDataSet.current = record;
    Modal.open({
      key: editKey,
      title: formatClient({ id: 'edit' }),
      children: <EditRecord
        dataSet={clientDataSet}
        record={clientDataSet.current}
        clientStore={clientStore}
        isProject={isProject}
        projectId={projectId}
      />,
      style: {
        width: 380,
      },
      drawer: true,
      okText: formatCommon({ id: 'save' }),
    });
  }
  async function openCreateRecordModal() {
    let initData;
    if (isProject) {
      initData = await axios.get(`/iam/choerodon/v1/organizations/${orgId}/clients-project/${projectId}/createInfo`);
    } else {
      initData = await axios.get(`/iam/choerodon/v1/organizations/${orgId}/clients/createInfo`);
    }
    initData.accessTokenValidity = 3600;
    initData.refreshTokenValidity = 3600;
    initData.autoApprove = 'default';
    initData.scope = 'default';
    initData.additionalInformation = '{}';

    await clientDataSet.create(initData);

    Modal.open({
      key: createKey,
      title: formatClient({ id: 'add' }),
      children: <CreateRecord isProject={isProject} dataSet={clientDataSet} />,
      style: {
        width: 380,
      },
      drawer: true,
      okText: formatClient({ id: 'addtext' }),
    });
  }
  async function openRoleManageModal(record) {
    clientDataSet.current = record;
    const roleData = await clientStore.loadClientRoles(orgId, record.get('id'), isProject, projectId);
    const roleIds = (roleData || []).map(({ id: roleId }) => roleId);
    await record.set('roles', roleIds || []);
    Modal.open({
      key: roleKey,
      title: `为客户端"${record.get('name')}"分配角色`,
      children: <EditRole
        optionsDataSet={optionsDataSet}
        organizationId={orgId}
        ds={clientDataSet}
        dataSet={optionsDataSet}
        record={clientDataSet.current}
        isProject={isProject}
        projectId={projectId}
      />,
      style: {
        width: 380,
      },
      drawer: true,
      okText: formatCommon({ id: 'save' }),
    });
  }
  function handleRowClick(record) {
    openEditRecordModal(record);
  }
  async function handleDelete(record) {
    Modal.open({
      title: formatClient({ id: 'delete' }),
      children: `确认删除客户端"${record.get('name')}"吗？`,
      maskClosable: false,
      okText: formatCommon({ id: 'delete' }),
      onOk: async () => {
        try {
          await axios.delete(
            isProject
              ? `/iam/choerodon/v1/organizations/${orgId}/clients-project/${projectId}/${record.get('id')}`
              : `/iam/choerodon/v1/organizations/${orgId}/clients/${record.get('id')}`,
          );
          await clientDataSet.query();
        } catch (err) {
          message.prompt(err);
        }
      },
    });
  }
  function handleRoleClick(record) {
    openRoleManageModal(record);
  }

  const renderAction = ({ record }) => {
    const actionDatas = [{
      service: [`choerodon.code.${isProject ? 'project' : 'organization'}.setting.client.ps.delete`],
      text: <FormattedMessage id="organization.client.delete.title" />,
      action: () => handleDelete(record),
    }, {
      service: [`choerodon.code.${isProject ? 'project' : 'organization'}.setting.client.ps.role`],
      text: '角色分配',
      action: () => handleRoleClick(record),
    }];
    return <Action data={actionDatas} />;
  };
  const filterData = (record) => record.status !== 'add';
  const renderName = ({ text, record }) => (
    <Permission
      service={[`choerodon.code.${isProject ? 'project' : 'organization'}.setting.client.ps.update`]}
      defaultChildren={(<span>{text}</span>)}
    >
      <span role="none" className="link" onClick={() => handleRowClick(record)}>
        {text}
      </span>
    </Permission>
  );
  return (
    <Page service={[`choerodon.code.${isProject ? 'project' : 'organization'}.setting.client.ps.default`]}>
      <Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: formatClient({ id: 'edit' }),
            icon: 'playlist_add',
            display: true,
            permissions: [`choerodon.code.${isProject ? 'project' : 'organization'}.setting.client.ps.add`],
            handler: openCreateRecordModal,
          }])}
        />
      </Header>
      <Breadcrumb />
      <Content className="organization-pwdpolicy">
        <Table pristine filter={filterData} dataSet={clientDataSet} className="tab2">
          <Column renderer={renderName} width={250} name="name" align="left" />
          <Column width={60} renderer={renderAction} />
          <Column name="authorizedGrantTypes" width={500} />
        </Table>
      </Content>
    </Page>
  );
}));

export default (props) => (
  <StoreProvider {...props}>
    <Client />
  </StoreProvider>
);

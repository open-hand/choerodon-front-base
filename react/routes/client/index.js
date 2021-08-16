import React, { useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table, Icon, Button, message, Modal, Row, Col,
} from 'choerodon-ui/pro';
// import { Modal as OldModal } from 'choerodon-ui/pro';
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

const Client = withRouter(observer((props) => {
  const {
    clientDataSet, optionsDataSet, orgId, clientStore, isProject, projectId,
  } = useContext(Store);

  function openEditRecordModal(record) {
    clientDataSet.current = record;
    Modal.open({
      key: editKey,
      title: '修改客户端',
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
      okText: '保存',
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
      title: '添加客户端',
      children: <CreateRecord isProject={isProject} dataSet={clientDataSet} />,
      style: {
        width: 380,
      },
      drawer: true,
      okText: '添加',
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
      okText: '保存',
    });
  }
  function handleRowClick(record) {
    openEditRecordModal(record);
  }
  async function handleDelete(record) {
    Modal.open({
      title: '删除客户端',
      content: `确认删除客户端"${record.get('name')}"吗？`,
      maskClosable: false,
      okText: '删除',
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

  function renderAction({ record }) {
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
  }
  function filterData(record) {
    return record.status !== 'add';
  }
  function renderName({ text, record }) {
    return (
      <Permission
        service={[`choerodon.code.${isProject ? 'project' : 'organization'}.setting.client.ps.update`]}
        defaultChildren={(<span>{text}</span>)}
      >
        <span role="none" className="link" onClick={() => handleRowClick(record)}>
          {text}
        </span>
      </Permission>
    );
  }
  return (
    <Page service={[`choerodon.code.${isProject ? 'project' : 'organization'}.setting.client.ps.default`]}>
      <Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: '添加客户端',
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

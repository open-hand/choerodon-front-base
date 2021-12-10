/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Action, Content, Header, axios, Breadcrumb, Page, Permission, Choerodon, HeaderButtons,
} from '@choerodon/boot';
import { Tag } from 'choerodon-ui';
import { Table, Modal } from 'choerodon-ui/pro';
import Store from './stores';
import FormView from './create-role';

import './index.less';

const { Column } = Table;

const modalKey = Modal.key();
const modalStyle = {
  width: 740,
};

const ListView = () => {
  const context = useContext(Store);
  const {
    intl: { formatMessage },
    AppState: { currentMenuType: { organizationId } },
    listDataSet: dataSet,
    prefixCls,
    permissions,
    intlPrefix,
    formatCommon,
    formatClient,
  } = context;

  const refresh = () => {
    dataSet.query();
  };

  function openModal(type, level) {
    const record = dataSet.current;
    const okText = {
      detail: '关闭',
      edit: '保存',
      add: '创建',
    };
    Modal.open({
      key: modalKey,
      drawer: true,
      title: `${type === 'add' ? '添加' : '修改'}${level === 'organization' ? '组织' : '项目'}角色`,
      children: (
        <FormView
          level={level}
          roleId={type === 'add' ? null : record.get('id')}
          refresh={refresh}
          type={type}
        />
      ),
      okCancel: type !== 'detail',
      okText: okText[type] ?? '创建',
      style: modalStyle,
    });
  }

  function openEnabledModal() {
    const record = dataSet.current;
    const enabled = record.get('enabled');
    if (enabled) {
      Modal.open({
        key: Modal.key(),
        title: formatMessage({ id: `${intlPrefix}.enable.title` }),
        children: formatMessage({ id: `${intlPrefix}.enable.des` }, { name: record.get('name') }),
        movable: false,
        onOk: () => handleEnabled(true),
      });
    } else {
      handleEnabled(false);
    }
  }

  async function handleEnabled(enabled) {
    const record = dataSet.current;
    const postData = record.toData();
    try {
      await axios.put(`/iam/hzero/v1/${organizationId}/roles/${enabled ? 'disable' : 'enable'}`, JSON.stringify(postData));
      dataSet.query();
    } catch (e) {
      Choerodon.handleResponseError(e);
    }
  }

  function handleDelete() {
    const record = dataSet.current;
    const modalProps = {
      title: formatMessage({ id: `${intlPrefix}.delete.title` }),
      children: formatMessage({ id: `${intlPrefix}.delete.des` }, { name: record.get('name') }),
      okText: formatMessage({ id: 'delete' }),
    };
    dataSet.delete(record, modalProps);
  }

  const renderName = ({ value, record: tableRecord }) => {
    const defaultChildren = <span>{value}</span>;
    if (tableRecord.get('builtIn')) {
      return (
        <Permission
          service={['choerodon.code.organization.manager.role.ps.detail']}
          defaultChildren={defaultChildren}
        >
          <span
            onClick={() => openModal('detail', tableRecord.get('roleLevel'))}
            className="link"
          >
            {value}
          </span>
        </Permission>
      );
    }
    return (
      <Permission
        service={['choerodon.code.organization.manager.role.ps.update']}
        defaultChildren={defaultChildren}
      >
        <span
          onClick={() => openModal('edit', tableRecord.get('roleLevel'))}
          className="link"
        >
          {value}
        </span>
      </Permission>
    );
  };

  const renderAction = ({ record }) => {
    const enabled = record.get('enabled');
    const builtIn = record.get('builtIn');
    const actionDatas = [
      {
        service: [enabled ? 'choerodon.code.organization.manager.role.ps.disable' : 'choerodon.code.organization.manager.role.ps.enable'],
        text: enabled ? formatCommon({ id: 'stop' }) : formatCommon({ id: 'enable' }),
        action: openEnabledModal,
      },
    ];
    if (!enabled) {
      actionDatas.push({
        service: ['choerodon.code.organization.manager.role.ps.delete'],
        text: formatCommon({ id: 'delete' }),
        action: handleDelete,
      });
    }
    return !builtIn && <Action data={actionDatas} />;
  };

  const renderBuildIn = ({ value }) => (value ? formatClient({ id: 'predefined' }) : formatClient({ id: 'custom' }));

  const renderEnabled = ({ value }) => <Tag color={value ? '#00bfa5' : '#d3d3d3'}>{value ? formatCommon({ id: 'enable' }) : formatCommon({ id: 'stop' })}</Tag>;

  const renderLevel = ({ value }) => (value === 'project' ? formatClient({ id: 'projectLevel' }) : formatClient({ id: 'organizationLevel' }));

  return (
    <Page service={permissions}>
      <Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: formatClient({ id: 'creatingOrganizationRole' }),
            icon: 'playlist_add',
            display: true,
            permissions: ['choerodon.code.organization.manager.role.ps.create.organization'],
            handler: () => openModal('add', 'organization'),
          }, {
            name: formatClient({ id: 'creatingProjectRole' }),
            icon: 'playlist_add',
            display: true,
            permissions: ['choerodon.code.organization.manager.role.ps.create.project'],
            handler: () => openModal('add', 'project'),
          }])}
        />
      </Header>
      <Breadcrumb />
      <Content className={`${prefixCls}`}>
        <Table dataSet={dataSet}>
          <Column name="name" width={200} renderer={renderName} />
          <Column renderer={renderAction} width={60} />
          <Column name="code" />
          <Column name="roleLevel" renderer={renderLevel} width={150} />
          <Column name="builtIn" renderer={renderBuildIn} width={150} align="left" />
          <Column name="enabled" renderer={renderEnabled} width={150} align="left" />
        </Table>
      </Content>
    </Page>
  );
};

export default observer(ListView);

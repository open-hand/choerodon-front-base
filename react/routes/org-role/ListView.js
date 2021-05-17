/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Action, Content, Header, axios, Breadcrumb, Page, Permission, Choerodon, HeaderButtons,
} from '@choerodon/boot';
import { Button, Tag } from 'choerodon-ui';
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
  } = context;

  function refresh() {
    dataSet.query();
  }

  function openModal(type, level) {
    const record = dataSet.current;
    Modal.open({
      key: modalKey,
      drawer: true,
      title: formatMessage({ id: `${intlPrefix}.${type}` }),
      children: (
        <FormView
          level={level}
          roleId={type === 'add' ? null : record.get('id')}
          refresh={refresh}
          type={type}
        />
      ),
      okCancel: type !== 'detail',
      okText: formatMessage({ id: type === 'detail' ? 'close' : 'ok' }),
      style: modalStyle,
    });
  }

  function openEnabledModal() {
    const record = dataSet.current;
    const enabled = record.get('enabled');
    if (enabled) {
      Modal.open({
        key: Modal.key(),
        title: formatMessage({ id: `${intlPrefix}.enable.title` }, { name: record.get('name') }),
        children: formatMessage({ id: `${intlPrefix}.enable.des` }),
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
      title: formatMessage({ id: `${intlPrefix}.delete.title` }, { name: record.get('name') }),
      children: formatMessage({ id: `${intlPrefix}.delete.des` }),
      okText: formatMessage({ id: 'delete' }),
      okProps: { color: 'red' },
      cancelProps: { color: 'dark' },
    };
    dataSet.delete(record, modalProps);
  }

  function renderName({ value, record: tableRecord }) {
    const defaultChildren = <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{value}</span>;
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
  }

  function renderAction({ record }) {
    const enabled = record.get('enabled');
    const builtIn = record.get('builtIn');
    const actionDatas = [
      {
        service: [enabled ? 'choerodon.code.organization.manager.role.ps.disable' : 'choerodon.code.organization.manager.role.ps.enable'],
        text: enabled ? '停用' : '启用',
        action: openEnabledModal,
      },
    ];
    if (!enabled) {
      actionDatas.push({
        service: ['choerodon.code.organization.manager.role.ps.delete'],
        text: '删除',
        action: handleDelete,
      });
    }
    return !builtIn && <Action data={actionDatas} />;
  }

  function renderBuildIn({ value }) {
    return value ? '预定义' : '自定义';
  }

  function renderEnabled({ value }) {
    return <Tag color={value ? '#00bfa5' : '#d3d3d3'}>{value ? '启用' : '停用'}</Tag>;
  }

  function renderLevel({ value }) {
    return value === 'project' ? '项目层' : '组织层';
  }

  return (
    <Page service={permissions}>
      <Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: '创建组织角色',
            icon: 'playlist_add',
            display: true,
            permissions: ['choerodon.code.organization.manager.role.ps.create.organization'],
            handler: () => openModal('add', 'organization'),
          }, {
            name: '创建项目角色',
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
          <Column name="code" style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
          <Column name="roleLevel" renderer={renderLevel} width={150} style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
          <Column name="builtIn" renderer={renderBuildIn} width={150} align="left" style={{ color: 'rgba(0, 0, 0, 0.65)' }} />
          <Column name="enabled" renderer={renderEnabled} width={150} align="left" />
        </Table>
      </Content>
    </Page>
  );
};

export default observer(ListView);

import React, { useContext, useState, Fragment } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  TextField,
  Table, Modal, message,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import {
  Action, Content, Header, axios, Permission, Breadcrumb, TabPage,
} from '@choerodon/boot';
import { Button, Modal as OldModal, Icon } from 'choerodon-ui';

import expandMoreColumn from '../../../components/expandMoreColumn';
import DeleteRoleModal from '../DeleteRoleModal';
import StatusTag from '../../../components/statusTag';
import Store from './stores';
import Sider from './sider';
import './index.less';

const modalKey = Modal.key();

let InviteModal = false;
try {
  // eslint-disable-next-line global-require
  const { default: requireData } = require('@choerodon/base-business/lib/routes/invite-user');
  InviteModal = requireData;
} catch (error) {
  InviteModal = false;
}

const { Column } = Table;
export default observer((props) => {
  const {
    intlPrefix,
    orgUserListDataSet: dataSet,
    projectId,
    orgUserCreateDataSet,
    orgUserRoleDataSet,
    organizationId,
    orgRoleDataSet,
    allRoleDataSet,
    AppState,
  } = useContext(Store);

  if (AppState.getCurrentTheme === 'theme4') {
    import('./theme4.less');
  }

  const [deleteRoleRecord, setDeleteRoleRecord] = useState(undefined);

  const modalProps = {
    create: {
      okText: '保存',
      title: '添加团队成员',
    },
    addRole: {
      okText: '保存',
      title: '修改团队成员',
    },
    invite: {
      okText: '发送邀请',
      title: '邀请成员',
    },
    importRole: {
      okText: '返回',
      okCancel: false,
      title: '导入团队成员',
    },
  };
  function handleSave() {
    dataSet.query();
  }
  function openModal(type) {
    Modal.open({
      ...modalProps[type],
      children: <Sider
        type={type}
        allRoleDataSet={allRoleDataSet}
        orgRoleDataSet={orgRoleDataSet}
        orgUserRoleDataSet={orgUserRoleDataSet}
        orgUserCreateDataSet={orgUserCreateDataSet}
        orgUserListDataSet={dataSet}
        onOk={handleSave}
      />,
      key: modalKey,
      drawer: true,
      style: { width: 380 },
      fullScreen: true,
      destroyOnClose: true,
      className: 'base-project-user-sider',
    });
  }
  function handleUserRole(record) {
    const data = record.toData();
    data.roles = data.roles.map((v) => v.id);
    if (data.roles.length === 0) data.roles = [''];
    orgUserRoleDataSet.create(data);
    openModal('addRole');
  }
  function handleCreate() {
    openModal('create');
  }
  function handleImportRole() {
    openModal('importRole');
  }

  const handleCancel = () => {
    setDeleteRoleRecord(undefined);
    handleSave();
  };

  function handleDeleteUser(record) {
    const roleIds = (record.get('roles') || []).map(({ id }) => id);
    const postData = {
      memberType: 'user',
      view: 'userView',
      sourceId: Number(projectId),
      data: { [record.get('id')]: roleIds },
    };
    if (InviteModal && AppState.menuType.category === 'PROGRAM') {
      setDeleteRoleRecord(record);
    } else {
      OldModal.confirm({
        className: 'c7n-iam-confirm-modal',
        title: '删除用户',
        content: `确认删除用户"${record.get('realName')}"在本项目下的全部角色吗?`,
        onOk: async () => {
          const result = await axios.post(`/iam/choerodon/v1/projects/${projectId}/users/${record.get('id')}/role_members/delete`, JSON.stringify(postData));
          if (!result.failed) {
            await orgUserRoleDataSet.reset();
            dataSet.query();
            return true;
          }
          message.error(result.message);
          return false;
        },
      });
    }
  }
  function rednerEnabled({ value }) {
    return <StatusTag name={value ? '启用' : '停用'} colorCode={value ? 'COMPLETED' : 'DEFAULT'} />;
  }
  function label(record) {
    return record.get('organizationId').toString() !== organizationId ? (
      <div className="project-user-external-user">
        <span className="project-user-external-user-text">
          外部人员
        </span>
      </div>
    ) : null;
  }
  function programLabel(record) {
    return record.get('programOwner') ? (
      <div className="project-user-external-user">
        <span className="project-user-external-user-text">
          项目群人员
        </span>
      </div>
    ) : null;
  }

  // 外部人员
  function renderUserName({ value, record }) {
    // const programLabel = InviteModal && record.get('programOwner') ? (
    return (
      <>
        <Permission
          service={['choerodon.code.project.cooperation.team-member.ps.update']}
          defaultChildren={(<span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>{value}</span>)}
        >
          <span
            onClick={() => handleUserRole(record)}
            className="link"
            role="none"
          >
            {value}
          </span>
        </Permission>
        {label(record)}
        {programLabel(record)}
      </>
    );
  }

  function renderAction({ record }) {
    const actionDatas = [{
      service: ['choerodon.code.project.cooperation.team-member.ps.delete'],
      text: '删除',
      action: () => handleDeleteUser(record),
    }];
    return InviteModal && record.get('programOwner') ? '' : <Action data={actionDatas} />;
  }

  function getInitialButton() {
    if (InviteModal) {
      return (
        <InviteModal
          allRoleDataSet={allRoleDataSet}
          orgRoleDataSet={orgRoleDataSet}
          orgUserRoleDataSet={orgUserRoleDataSet}
          orgUserCreateDataSet={orgUserCreateDataSet}
          orgUserListDataSet={dataSet}
          onOk={handleSave}
        />
      );
    }
    return null;
  }

  function renderNewContent() {
    console.log(dataSet.toData());
    return (
      <div className="theme4-c7n-member">
        {dataSet.toData().map((item) => (
          <div className="theme4-c7n-memberItem">
            <div className="theme4-c7n-memberItem-line">
              <div
                className="theme4-c7n-memberItem-line-icon"
                style={{
                  ...item.imageUrl ? {
                    backgroundImage: `url(${item.imageUrl})`,
                  } : {
                    background: '#F0F5FF',
                  },
                }}
              >
                {
                  !item.imageUrl && item.loginName.substring(0, 1).toUpperCase()
                }
              </div>
              <div
                className="theme4-c7n-memberItem-line-name"
              >
                <p className="theme4-c7n-memberItem-line-name-realName">
                  <span className="theme4-c7n-memberItem-line-name-realName-text">{item.realName}</span>
                  <StatusTag name={item.enabled ? '启用' : '停用'} colorCode={item.enabled ? 'COMPLETED' : 'DEFAULT'} />
                </p>
                <p className="theme4-c7n-memberItem-line-name-loginName">{item.loginName}</p>
              </div>
            </div>
            <div className="theme4-c7n-memberItem-line" style={{ justifyContent: 'space-between', marginTop: 16 }}>
              <p className="theme4-c7n-memberItem-line-key">
                角色:
              </p>
              <p className="theme4-c7n-memberItem-line-value">
                {expandMoreColumn({
                  value: '',
                  record: {
                    getPristineValue: (key) => item.roles,
                  },
                })}
              </p>
            </div>
            <div className="theme4-c7n-memberItem-line" style={{ justifyContent: 'space-between', marginTop: 11 }}>
              <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className="theme4-c7n-memberItem-line-key">
                手机:
              </p>
              <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className="theme4-c7n-memberItem-line-value">
                {item.phone}
              </p>
            </div>
            <div className="theme4-c7n-memberItem-line" style={{ justifyContent: 'space-between', marginTop: 11 }}>
              <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className="theme4-c7n-memberItem-line-key">
                邮箱:
              </p>
              <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className="theme4-c7n-memberItem-line-value">
                {item.email}
              </p>
            </div>
            <div className="theme4-c7n-memberItem-line" style={{ marginTop: 11 }}>
              {label({ get: (key) => item[key] })}
              {programLabel({ get: (key) => item[key] })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <TabPage service={['choerodon.code.project.cooperation.team-member.ps.default']}>
      <Header
        title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
      >
        <Permission service={['choerodon.code.project.cooperation.team-member.ps.add']}>
          <Button
            icon="person_add"
            onClick={handleCreate}
          >
            添加团队成员
          </Button>
        </Permission>
        <Permission service={['choerodon.code.project.cooperation.team-member.ps.import']}>
          <Button
            icon="archive"
            onClick={handleImportRole}
          >
            导入团队成员
          </Button>
        </Permission>
        {getInitialButton()}
      </Header>
      <Breadcrumb
        {
          ...AppState.getCurrentTheme === 'theme4' ? {
            extraNode: (<TextField style={{ marginLeft: 32 }} suffix={<Icon type="search" />} />),
          } : {}
        }
      />
      <DeleteRoleModal
        deleteRoleRecord={deleteRoleRecord}
        handleCancel={handleCancel}
        projectId={projectId}
      />
      <Content
        className="project-user"
      >
        {
          AppState.getCurrentTheme === 'theme4' ? renderNewContent() : (
            <Table labelLayout="float" pristine dataSet={dataSet}>
              <Column renderer={renderUserName} name="realName" />
              <Column renderer={renderAction} width={50} align="right" />
              <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="loginName" tooltip="overflow" />
              <Column minWidth={320} width={320} renderer={expandMoreColumn} className="project-user-roles" name="myRoles" />
              <Column renderer={rednerEnabled} width={100} name="enabled" align="left" />
            </Table>
          )
        }
      </Content>
    </TabPage>
  );
});

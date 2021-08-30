import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
  Action,
  Content,
  Header,
  axios,
  Permission,
  Breadcrumb,
  Page,
  HeaderButtons,
} from '@choerodon/boot';
// import { Modal as OldModal, Tooltip, Button } from 'choerodon-ui';
import { Tooltip } from 'choerodon-ui';
import {
  Select,
  SelectBox,
  Table,
  TextField,
  Modal,
  message,
  Icon,
  Button as ProButton,
  Radio,
} from 'choerodon-ui/pro';
import { SagaDetails } from '@choerodon/master';
import OrgUserServices from '@/routes/org-user/list/services';
import expandMoreColumn from '../../../components/expandMoreColumn';
import StatusTag from '../../../components/statusTag';
import Store from './stores';
import Sider from './sider';
import LdapModal from './ldapModal';

import './index.less';

const modalKey = Modal.key();
const syncModalKey = Modal.key();
const modalStyle = {
  width: 740,
};

// eslint-disable-next-line no-undef
const HAS_BASE_PRO = C7NHasModule('@choerodon/base-pro');

const { Column } = Table;

const DeleteChildren = observer((props) => {
  const {
    record, orgName, modal, organizationId, orgUserRoleDataSet, dataSet,
  } = props;

  // 删除用户下拉框的选项值
  const [deleteOption, setDeleteOption] = useState(undefined);

  const handleChangeDeleteOption = (value) => {
    setDeleteOption(value);
  };

  useEffect(() => {
    modal.update({
      okProps: {
        disabled: !deleteOption,
      },
    });
  }, [deleteOption]);

  modal.handleOk(async () => {
    const result = await axios.delete(
      `/iam/choerodon/v1/organizations/${organizationId}/users/${
        record.toData().id
      }/delete?onlyOrganization=${deleteOption === 'onlyOrg'}`,
    );
    if (!result.failed) {
      await orgUserRoleDataSet.reset();
      dataSet.query();
      return true;
    }
    message.error(result.message);
    return false;
  });

  return (
    <>
      <p>{`确认删除用户"${record.get('realName')}"在组织"${orgName}"下的全部角色吗?`}</p>
      <Radio name="options" value="onlyOrg" onChange={handleChangeDeleteOption}>
        仅删除该用户在组织层的所有角色
      </Radio>
      <Radio
        style={{ marginTop: 10 }}
        name="options"
        value="all"
        onChange={handleChangeDeleteOption}
      >
        删除该用户在组织层及组织下所有项目中的角色
      </Radio>
    </>
  );
});

export default withRouter(
  observer((props) => {
    const {
      intlPrefix,
      permissions,
      intl: { formatMessage },
      AppState,
      orgUserListDataSet: dataSet,
      organizationId,
      orgUserCreateDataSet,
      orgUserRoleDataSet,
      orgRoleDataSet,
      orgAllRoleDataSet,
      passwordPolicyDataSet,
      userStore,
    } = useContext(Store);
    const { getCanCreate } = userStore;
    const modalProps = {
      create: {
        okText: '保存',
        title: '创建用户',
      },
      modify: {
        okText: '保存',
        title: '修改用户',
      },
      importUser: {
        okText: '确定',
        title: '导入用户',
      },
      roleAssignment: {
        okText: '确定',
        title: '添加组织用户',
      },
      addRole: {
        okText: '确定',
        title: '修改组织用户',
      },
      importRole: {
        okText: '返回',
        okCancel: false,
        title: '导入组织用户',
      },
    };
    async function handleDisable(record) {
      try {
        await axios.put(
          `/iam/choerodon/v1/organizations/${organizationId}/users/${record.get('id')}/disable`,
        );
        const result = await dataSet.query();
        if (result.failed) {
          throw result.message;
        }
      } catch (err) {
        message.error(err);
      }
    }
    // eslint-disable-next-line consistent-return
    async function handleEnable(record) {
      try {
        // 如果是汉得版 需要先校验人数是否超过限制
        if (HAS_BASE_PRO) {
          const res = await OrgUserServices.axiosGetCheckEnableUser(organizationId);
          // 可创建
          if (res.enableUser) {
            rest();
          } else {
            Modal.confirm({
              title: '组织用户已达套餐限量',
              children: `当前组织的启用用户数量已达套餐限量：${res.limitUserCount}人。若想启用新的组织用户，请联系组织注册者升级套餐人数。`,
              okText: '我知道了',
              okCancel: false,
            });
          }
        } else {
          rest();
        }
        // eslint-disable-next-line no-inner-declarations
        async function rest() {
          const result = await axios.put(
            `/iam/choerodon/v1/organizations/${organizationId}/users/${record.get('id')}/enable`,
          );
          if (result.failed) {
            throw result.message;
          }
          dataSet.query();
        }
      } catch (err) {
        return message.error(err);
      }
    }
    async function handleUnLock(record) {
      try {
        const result = await axios.put(
          `/iam/choerodon/v1/organizations/${organizationId}/users/${record.get('id')}/unlock`,
        );
        if (result.failed) {
          throw result.message;
        }
        await dataSet.query();
      } catch (err) {
        message.error(err);
      }
    }
    async function resetPassword(userId) {
      try {
        const result = await axios.put(
          `/iam/choerodon/v1/organizations/${organizationId}/users/${userId}/reset`,
        );
        if (!result.failed) {
          dataSet.query();
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    }

    function handleResetPassword(record) {
      Modal.open({
        key: modalKey,
        title: '确认重置当前用户密码',
        children: (
          <div>
            <p>
              {`"${record.get('realName')}"`}
              用户的当前密码将失效。如果您启用组织密码策略，将重置为组织默认密码，否则将重置为平台密码。
            </p>
          </div>
        ),
        onOk: () => resetPassword(record.get('id')),
      });
    }
    function handleSave() {
      dataSet.query();
      userStore.checkCreate(organizationId);
    }
    function openModal(type, password) {
      Modal.open({
        ...modalProps[type],
        children: (
          <Sider
            type={type}
            password={password}
            orgRoleDataSet={orgRoleDataSet}
            orgAllRoleDataSet={orgAllRoleDataSet}
            orgUserRoleDataSet={orgUserRoleDataSet}
            orgUserCreateDataSet={orgUserCreateDataSet}
            orgUserListDataSet={dataSet}
            onOk={handleSave}
            userStore={userStore}
          />
        ),
        key: modalKey,
        drawer: true,
        style: { width: 380 },
        fullScreen: true,
        cancelText: '取消',
        destroyOnClose: true,
        className: 'base-org-user-sider',
      });
    }
    function handleModify(record) {
      dataSet.current = record;
      openModal('modify');
    }
    function handleUserRole(record) {
      const data = record.toData();
      data.roles = data.roles.map((v) => v.id);
      if (data.roles.length === 0) data.roles = [''];
      orgUserRoleDataSet.create(data);
      openModal('addRole');
    }
    function handleCreate() {
      let password = AppState.siteInfo.defaultPassword || 'abcd1234';
      if (passwordPolicyDataSet.current && passwordPolicyDataSet.current.get('enablePassword')) {
        password = passwordPolicyDataSet.current.get('originalPassword');
      }
      // orgUserCreateDataSet.create({ roles: [''], password });
      // openModal('create');
      orgUserCreateDataSet.create({ roles: [''] });
      openModal('create', password);
    }
    function handleRoleAssignment() {
      openModal('roleAssignment');
    }
    function handleImportUser() {
      openModal('importUser');
    }
    function handleImportRole() {
      openModal('importRole');
    }

    function handleDeleteUser(record) {
      const orgName = AppState.currentMenuType.name;
      Modal.open({
        className: 'c7n-iam-confirm-modal',
        title: '删除用户',
        children: (
          <DeleteChildren
            organizationId={organizationId}
            record={record}
            orgName={orgName}
            orgUserRoleDataSet={orgUserRoleDataSet}
            dataSet={dataSet}
          />
        ),
        okProps: {
          disabled: true,
        },
        okText: '删除',
        // eslint-disable-next-line consistent-return
      });
    }

    function linkToLDAP() {
      const {
        history,
        location: { search },
      } = props;
      history.push(`/iam/organization-setting/ldap${search}`);
    }

    async function handleSyncSetting() {
      const res = await axios.get(`/iam/v1/${organizationId}/ldaps`);
      Modal.open({
        key: syncModalKey,
        style: modalStyle,
        drawer: true,
        title: (
          <div className="org-user-sync-title">
            <span>LDAP同步设置</span>
            <Tooltip title="若同步过程中因为配置的问题无法执行，请点击“转至LDAP设置”按钮在详情界面进行配置">
              <Icon type="help" className="org-user-sync-title-icon" />
            </Tooltip>
          </div>
        ),
        children: <LdapModal ldapId={res.id} />,
        okText: '手动同步',
        cancelText: '关闭',
        footer: (okBtn, cancelBtn) => (
          <div>
            {cancelBtn}
            {okBtn}
            <ProButton color="primary" funcType="raised" onClick={linkToLDAP}>
              转至LDAP设置
            </ProButton>
          </div>
        ),
      });
    }

    // function renderLoginName({ value }) {
    //   return <Tooltip title={value}>{value}</Tooltip>;
    // }

    function renderLocked({ value }) {
      return value ? '锁定' : '未锁定';
    }
    function rednerEnabled({ value }) {
      return (
        <StatusTag name={value ? '启用' : '停用'} colorCode={value ? 'COMPLETED' : 'DEFAULT'} />
      );
    }

    const openSagaDetails = (id) => {
      Modal.open({
        title: formatMessage({ id: 'global.saga-instance.detail' }),
        key: Modal.key(),
        children: <SagaDetails sagaInstanceId={id} instance />,
        drawer: true,
        okCancel: false,
        okText: formatMessage({ id: 'close' }),
        style: {
          width: 'calc(100% - 3.5rem)',
        },
      });
    };

    function renderUserName({ value, record }) {
      const idEqual = record.get('organizationId').toString() !== organizationId;
      const service = idEqual ? ['choerodon.code.organization.manager.user.ps.update'] : [];
      return (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Permission service={service} defaultChildren={<span>{value}</span>}>
            <>
              <span
                role="none"
                onClick={idEqual ? () => handleUserRole(record) : () => handleModify(record)}
                className="link"
                style={{
                  maxWidth: '1rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </span>
              {idEqual && (
                <>
                  <div className="org-user-external-user">
                    <span className="org-user-external-user-text">外部人员</span>
                  </div>
                </>
              )}
              {record.get('sagaInstanceId') ? (
                <Icon
                  className="org-user-dashBoard"
                  type="developer_board"
                  onClick={() => openSagaDetails(record.get('sagaInstanceId'))}
                />
              ) : (
                ''
              )}
            </>
          </Permission>
        </span>
      );
    }
    function getQueryFields() {
      return {
        realName: <TextField clearButton labelLayout="float" />,
        roleName: <Select dropdownMenuStyle={{ width: 260 }} labelLayout="float" />,
        loginName: <TextField clearButton labelLayout="float" />,
        enabled: <SelectBox mode="button" />,
        locked: <SelectBox mode="button" />,
      };
    }
    function renderAction({ record }) {
      let actionDatas = record.get('ldap')
        ? []
        : [
          {
            service: ['choerodon.code.organization.manager.user.ps.reset.password'],
            text: <FormattedMessage id={`${intlPrefix}.action.reset`} />,
            action: () => handleResetPassword(record),
          },
        ];
      // 外部人员的处理
      if (
        record.get('organizationId').toString() !== organizationId
        || record.get('sagaInstanceId')
      ) {
        actionDatas = [
          {
            service: ['choerodon.code.organization.manager.user.ps.delete'],
            text: '删除',
            action: () => handleDeleteUser(record),
          },
        ];
        return <Action data={actionDatas} />;
      }
      if (record.get('enabled')) {
        actionDatas.push({
          service: ['choerodon.code.organization.manager.user.ps.disable'],
          text: <FormattedMessage id={`${intlPrefix}.action.disable`} />,
          action: () => handleDisable(record),
        });
      } else {
        actionDatas.push({
          service: ['choerodon.code.organization.manager.user.ps.enable'],
          text: <FormattedMessage id={`${intlPrefix}.action.enable`} />,
          action: () => handleEnable(record),
        });
      }
      if (record.get('locked')) {
        actionDatas.push({
          service: ['choerodon.code.organization.manager.user.ps.unlock'],
          text: <FormattedMessage id={`${intlPrefix}.action.unlock`} />,
          action: () => handleUnLock(record),
        });
      }
      return <Action data={actionDatas} />;
    }

    function renderSource({ value }) {
      return formatMessage({ id: `${intlPrefix}.${value ? 'ldap' : 'notldap'}` });
    }

    return (
      <Page service={permissions}>
        <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>
          <HeaderButtons
            showClassName={false}
            items={[
              {
                name: <FormattedMessage id={`${intlPrefix}.button.create-user`} />,
                icon: 'playlist_add',
                display: true,
                permissions: ['choerodon.code.organization.manager.user.ps.create'],
                handler: handleCreate,
                disabled: !getCanCreate,
              },
              {
                name: <FormattedMessage id={`${intlPrefix}.button.import-user`} />,
                icon: 'archive-o',
                display: true,
                permissions: ['choerodon.code.organization.manager.user.ps.import'],
                handler: handleImportUser,
                disabled: !getCanCreate,
              },
              {
                name: '添加组织用户',
                icon: 'person_add-o',
                display: true,
                permissions: ['choerodon.code.organization.manager.user.ps.add.user'],
                handler: handleRoleAssignment,
              },
              {
                name: '导入组织用户',
                icon: 'archive-o',
                display: true,
                permissions: ['choerodon.code.organization.manager.user.ps.import.user'],
                handler: handleImportRole,
              },
              {
                name: 'LDAP同步设置',
                icon: 'compare_arrows',
                display: true,
                permissions: ['choerodon.code.organization.manager.user.ps.ldap'],
                handler: handleSyncSetting,
              },
            ]}
          />
        </Header>
        <Breadcrumb />
        <Content className="org-user">
          <Table
            queryFields={getQueryFields()}
            queryFieldsLimit={3}
            labelLayout="float"
            pristine
            dataSet={dataSet}
          >
            <Column renderer={renderUserName} name="realName" />
            <Column renderer={renderAction} width={60} align="right" />
            <Column name="loginName" tooltip="overflow" />
            <Column renderer={rednerEnabled} name="enabled" align="left" width={70} />
            <Column
              minWidth={320}
              width={320}
              renderer={expandMoreColumn}
              className="org-user-roles"
              name="myRoles"
            />
            <Column renderer={renderSource} name="ldap" align="left" />
            <Column renderer={renderLocked} name="locked" align="left" width={100} />
          </Table>
        </Content>
      </Page>
    );
  }),
);

/* eslint-disable */
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
import {Tooltip } from 'choerodon-ui';
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
import { SagaDetails,UserLabels } from '@choerodon/master';
import OrgUserServices from '@/routes/org-user/list/services';
import expandMoreColumn from '../../../components/expandMoreColumn';
import StatusTag from '../../../components/statusTag';
import Store from './stores';
import Sider from './sider';
import LdapModal from './ldapModal';
import './index.less';

const modalKey = Modal.key();
const InviteModal = C7NTryImport('@choerodon/base-business/lib/routes/invite-user-manage');
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
      `/iam/choerodon/v1/organizations/${organizationId}/users/${record.toData().id
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
      <p>{`确认移出用户"${record.get('realName')}"在组织"${orgName}"下的全部角色吗?`}</p>
      <Radio name="options" value="onlyOrg" onChange={handleChangeDeleteOption}>
        仅移出该用户在组织层的所有角色
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
      formatProjectUser,
      formatCommon,
      safeOptionDs,
      statusOptionDs
    } = useContext(Store);
    const { getCanCreate } = userStore;
    useEffect(() => {
      dataSet.query()
    }, [])

    const refresh = ()=>{
      dataSet.query()
    }

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
    function getInitialButton() {
      if (InviteModal) {
        return (
          <InviteModal
            allRoleDataSet={orgAllRoleDataSet}
            orgRoleDataSet={orgRoleDataSet}
            onOk={handleSave}
          />
        );
      }
      return null;
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
            statusOptionDs={statusOptionDs}
            safeOptionDs={safeOptionDs}
            formatProjectUser={formatProjectUser}
            formatCommon={formatCommon}
            organizationId={organizationId}
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
      orgUserRoleDataSet.loadData([record.toData()]);
      openModal('modify');
    }
    function handleUserRole(record) {
      const data = record.toData();
      data.roles = data.roles.map((v) => v.id);
      if (data.roles.length === 0) data.roles = [''];
      orgUserRoleDataSet.loadData([data]);
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
        title: '移除用户',
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

    function linkToLDAP(modalInstance) {
      setTimeout(() => {
        const {
          history,
          location: { search },
        } = props;
        history.push(`/iam/organization-setting/ldap${search}`);
      }, 500);
      if (modalInstance) {
        modalInstance.close();
      }
    }

    async function handleSyncSetting() {
      const res = await axios.get(`/iam/v1/${organizationId}/ldaps`);
      const syncSetting = Modal.open({
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
        children: <LdapModal linkLDAP={(instance) => linkToLDAP(instance)} ldapId={res.id} />,
        okText: '手动同步',
        cancelText: '关闭',
        footer: (okBtn, cancelBtn) => (
          <div>
            {cancelBtn}
            {okBtn}
            <ProButton color="primary" funcType="raised" onClick={() => linkToLDAP(syncSetting)}>
              转至LDAP设置
            </ProButton>
          </div>
        ),
      });
    }

    function renderLocked({ value }) {
      return value ? formatProjectUser({id:'lock'}) : formatProjectUser({id:'unlock'});
    }
    function rednerEnabled({ value }) {
      return (
        <StatusTag name={value ? formatProjectUser({id:'action.enable'}) : formatProjectUser({id:'action.disable'})} colorCode={value ? 'COMPLETED' : 'DEFAULT'} />
      );
    }

    const openSagaDetails = (id) => {
      Modal.open({
        title: formatMessage({ id: 'global.saga-instance.detail' }),
        key: Modal.key(),
        children: <SagaDetails sagaInstanceId={id} instance />,
        drawer: true,
        okCancel: false,
        okText: formatCommon({id:'close'}),
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
                  marginRight: 6
                }}
              >
                {value}
              </span>
              <UserLabels list={record.get('userLabels') || []}/>
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
            text: formatProjectUser({id: 'action.reset'}),
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
            text: formatProjectUser({id: 'action.remove'}),
            action: () => handleDeleteUser(record),
          },
        ];
        return <Action data={actionDatas} />;
      }
      if (record.get('enabled')) {
        actionDatas.push({
          service: ['choerodon.code.organization.manager.user.ps.disable'],
          text: formatProjectUser({id: 'action.disable'}),
          action: () => handleDisable(record),
        });
      } else {
        actionDatas.push({
          service: ['choerodon.code.organization.manager.user.ps.enable'],
          text: formatProjectUser({id: 'action.enable'}),
          action: () => handleEnable(record),
        });
      }
      if (record.get('locked')) {
        actionDatas.push({
          service: ['choerodon.code.organization.manager.user.ps.unlock'],
          text: formatProjectUser({id: 'action.unlock'}),
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
        {getInitialButton()}
          <HeaderButtons
            showClassName={false}
            items={[
              {
                name: formatProjectUser({id: 'create'}),
                groupBtnItems: [{
                  name: formatProjectUser({id: 'createNew'}),
                   icon: 'playlist_add',
                  display: true,
                  permissions: ['choerodon.code.organization.manager.user.ps.create'],
                  handler:handleCreate,
                  disabled: !getCanCreate,
                },
                {
                name:formatProjectUser({id: 'importingNewUser'}),
                icon: 'archive-o',
                display: true,
                permissions: ['choerodon.code.organization.manager.user.ps.import'],
                handler: handleImportUser,
                disabled: !getCanCreate,
              }],
            },
            {
              name: formatProjectUser({id: 'button.addUser'}),
              groupBtnItems: [  {name: <Tooltip placement="left" title={<FormattedMessage id={`${intlPrefix}.add.user.tip`} />}>{formatProjectUser({id: 'button.assign-roles'})}</Tooltip>,
              icon: 'person_add-o',
              display: true,
              permissions: ['choerodon.code.organization.manager.user.ps.add.user'],
              handler: handleRoleAssignment,
            },
            {
              name: <Tooltip placement="left" title={<FormattedMessage id={`${intlPrefix}.import.user.tip`} />} >{formatProjectUser({id: 'button.importingOrganizationUsers'})}</Tooltip>,
              icon: 'archive-o',
              display: true,
              permissions: ['choerodon.code.organization.manager.user.ps.import.user'],
              handler: handleImportRole,
            }],
          },
              {
                name: formatProjectUser({id: 'button.LDAPSynchronizationSettings'}),
                icon: 'compare_arrows',
                display: true,
                permissions: ['choerodon.code.organization.manager.user.ps.ldap'],
                handler: handleSyncSetting,
              },
              {
                icon: 'refresh',
                display: true,
                handler: refresh,
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
            <Column renderer={renderUserName} name="realName" width={320}/>
            <Column renderer={renderAction} width={60} align="right" />
            <Column name="loginName" tooltip="overflow" />
            <Column renderer={rednerEnabled} name="enabled" align="left" />
            <Column
              // minWidth={320}
              width={320}
              renderer={expandMoreColumn}
              className="org-user-roles"
              name="myRoles"
              tooltip="overflow"
            />
            <Column renderer={renderSource} name="ldap" align="left" />
            <Column renderer={renderLocked} name="locked" align="left" width={150} />
          </Table>
        </Content>
      </Page>
    );
  }),
);

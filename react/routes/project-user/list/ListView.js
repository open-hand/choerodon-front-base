import React, {
  useContext, useState, Fragment, useImperativeHandle, useMemo, useEffect, useRef,
} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  TextField,
  Table, Modal, message, Tooltip,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { StatusTag, NewTips, CardPagination } from '@choerodon/components';
import {
  Action, //
  Content,
  Header,
  axios,
  Permission,
  Breadcrumb,
  Page,
  HeaderButtons,
  checkPermission,
  BrowserAdapter,
  CONSTANTS,
} from '@choerodon/boot';
import {
  Spin,
} from 'choerodon-ui';
import some from 'lodash/some';
import { usersApi } from '@/api';
import FilterPage from './components/FilterPage';
import expandMoreColumn from '../../../components/expandMoreColumn';
import DeleteRoleModal from '../DeleteRoleModal';
import Store from './stores';
import Sider from './sider';
import BatchAddRole from './components/batch-addRole';
import './index.less';

const {
  MODAL_WIDTH: {
    MIN,
  },
} = CONSTANTS;

const cssPrefix = 'c7ncd-projectUser';

const modalKey = Modal.key();

// eslint-disable-next-line no-undef
const InviteModal = C7NTryImport('@choerodon/base-business/lib/routes/invite-user');

export default BrowserAdapter(observer((props) => {
  const {
    cRef,
    breadCrumb,
    styles,
    render,
  } = props;

  const filterPageRef = useRef();

  const {
    orgUserListDataSet: dataSet,
    projectId,
    orgUserCreateDataSet,
    orgUserRoleDataSet,
    organizationId,
    orgRoleDataSet,
    allRoleDataSet,
    AppState,
    formatCommon,
    formatProjectUser,
  } = useContext(Store);

  const [deleteRoleRecord, setDeleteRoleRecord] = useState(undefined);
  const [permissions, setPermissions] = useState([{
    code: 'choerodon.code.project.cooperation.team-member.ps.update',
    approve: false,
  }, {
    code: 'choerodon.code.project.cooperation.team-member.ps.delete',
    approve: false,
  }]);
  const [mode, setMode] = useState(filterPageRef.current?.ModeList[0].value);

  useEffect(() => {
    function handleCheckPermission() {
      const data = {
        projectId,
        organizationId,
        resourceType: 'project',
      };
      const editPermission = checkPermission({
        ...data,
        code: permissions[0].code,
      });
      const deletePermission = checkPermission({
        ...data,
        code: permissions[1].code,
      });
      Promise.all([editPermission, deletePermission]).then((result) => {
        setPermissions([{
          code: permissions[0].code,
          approve: result[0],
        }, {
          code: permissions[1].code,
          approve: result[1],
        }]);
      });
    }
    handleCheckPermission();
  }, []);

  const modalProps = {
    create: {
      okText: formatCommon({ id: 'save' }),
      title: formatProjectUser({ id: 'addteammate' }),
    },
    addRole: {
      okText: formatCommon({ id: 'save' }),
      title: formatProjectUser({ id: 'modifyteammate' }),
    },
    invite: {
      okText: formatProjectUser({ id: 'sendInvitation' }),
      title: formatProjectUser({ id: 'inviteteammate' }),
    },
    importRole: {
      okText: formatCommon({ id: 'return' }),
      okCancel: false,
      title: formatProjectUser({ id: 'importteammate' }),
    },
  };

  useImperativeHandle(cRef, () => ({
    handleChangeSearch,
    renderUserName,
    renderAction,
    expandMoreColumn,
    rednerEnabled,
    renderNewContent,
  }));

  /**
   * 刷新
   */
  async function refresh() {
    await cRef.current.handleChangeSearch(filterPageRef.current.getQueryParameter());
  }

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
        // eslint-disable-next-line react/jsx-no-bind
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
  function handleUserRole(record, isData = false) {
    const newRecord = JSON.parse(JSON.stringify(record));
    const data = isData ? newRecord : newRecord.toData();
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
    const { categories } = AppState?.currentMenuType || {};
    if (InviteModal && some(categories || [], ['code', 'N_PROGRAM'])) {
      setDeleteRoleRecord(record);
    } else {
      Modal.confirm({
        key: Modal.key(),
        title: '删除用户',
        children: `确认删除用户"${record.get('realName')}"在本项目下的全部角色吗?`,
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
    ) : (
      <div className="project-user-external-user">
        <span className="project-user-external-user-text">
          内部人员
        </span>
      </div>
    );
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

  function renderAction({ record, item }) {
    const actionDatas = [{
      service: ['choerodon.code.project.cooperation.team-member.ps.update'],
      text: '修改',
      action: () => handleUserRole(item, true),
    }, {
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
          // eslint-disable-next-line react/jsx-no-bind
          onOk={handleSave}
        />
      );
    }
    return null;
  }

  function handleRenderActionDom(selfPermissions, record, item, isList) {
    const actionDatas = [];
    let flag = false;
    // 如果是项目群成员也加上这个按钮
    if (selfPermissions[0].approve || record.get('programOwner')) {
      flag = true;
      actionDatas.push({
        service: [],
        text: '修改',
        action: () => handleUserRole(item, true),
      });
    }
    // 必须不是项目群成员才能删除
    if (selfPermissions[1].approve && !record.get('programOwner')) {
      flag = true;
      actionDatas.push({
        service: [],
        text: '删除',
        action: () => handleDeleteUser(record),
      });
    }
    if (!flag) {
      return '';
    }
    return (
      <div
        className={`${styles['theme4-c7n-memberItem-action']} c7ncd-projectUser-action`}
        style={{
          background: isList ? 'unset' : 'rgba(83, 101, 234, 0.08)',
        }}
      >
        <Action data={actionDatas} />
      </div>
    );
  }

  function renderNewContent() {
    return (
      <Spin wrapperClassName={styles['theme4-c7n-spin']} spinning={dataSet.status == 'loading'}>
        {!mode || (mode === filterPageRef.current?.ModeList[0].value) ? (
          <div>
            <div className={styles['theme4-c7n-member']}>
              {
                dataSet.toData().map((item) => (
                  <div className={styles['theme4-c7n-memberItem']}>
                    {
                      handleRenderActionDom(permissions, {
                        get: (params) => item[params],
                      }, item)
                    }
                    <div className={styles['theme4-c7n-memberItem-line']}>
                      <div
                        className={styles['theme4-c7n-memberItem-line-icon']}
                        style={{
                          ...item.imageUrl ? {
                            backgroundImage: `url(${item.imageUrl})`,
                          } : {
                            background: '#F0F5FF',
                          },
                        }}
                      >
                        {
                          !item.imageUrl && item?.realName?.substring(0, 1)?.toUpperCase()
                        }
                      </div>
                      <div
                        className={styles['theme4-c7n-memberItem-line-name']}
                      >
                        <p className={styles['theme4-c7n-memberItem-line-name-realName']}>
                          <span
                            role="none"
                            className={styles['theme4-c7n-memberItem-line-name-realName-text']}
                          >
                            {item.realName}
                          </span>
                          <StatusTag name={item.enabled ? '启用' : '停用'} colorCode={item.enabled ? 'success' : ''} />
                        </p>
                        <p className={styles['theme4-c7n-memberItem-line-name-loginName']}>{item.loginName}</p>
                      </div>
                    </div>
                    <div className={styles['theme4-c7n-memberItem-line']} style={{ justifyContent: 'space-between', marginTop: 16 }}>
                      <p className={styles['theme4-c7n-memberItem-line-key']}>
                        角色:
                      </p>
                      <p className={styles['theme4-c7n-memberItem-line-value']}>
                        {expandMoreColumn({
                          customMaxTagCount: 1,
                          value: '',
                          record: {
                            getPristineValue: (key) => item.roles,
                          },
                        })}
                      </p>
                    </div>
                    <div className={styles['theme4-c7n-memberItem-line']} style={{ justifyContent: 'space-between', marginTop: 11 }}>
                      <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className={styles['theme4-c7n-memberItem-line-key']}>
                        手机:
                      </p>
                      <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className={styles['theme4-c7n-memberItem-line-value']}>
                        {item.phone}
                      </p>
                    </div>
                    <div className={styles['theme4-c7n-memberItem-line']} style={{ justifyContent: 'space-between', marginTop: 11 }}>
                      <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className={styles['theme4-c7n-memberItem-line-key']}>
                        邮箱:
                      </p>
                      <Tooltip title={item.email}>
                        <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className={styles['theme4-c7n-memberItem-line-value']}>
                          {item.email}
                        </p>
                      </Tooltip>
                    </div>
                    <div className={styles['theme4-c7n-memberItem-line']} style={{ marginTop: 11 }}>
                      <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className={styles['theme4-c7n-memberItem-line-key']}>
                        来源:
                      </p>
                      <p style={{ color: 'rgba(15, 19, 88, 0.45)' }} className={styles['theme4-c7n-memberItem-line-value']}>
                        {label({ get: (key) => item[key] })}
                        {programLabel({ get: (key) => item[key] })}
                      </p>
                    </div>
                  </div>
                ))
              }
              {/* {dataSet.toData().map((item) => )} */}
            </div>
            <CardPagination
              style={{
                textAlign: 'center',
                marginBottom: 32,
              }}
              total={dataSet.totalCount}
              page={dataSet.currentPage}
              pageSize={dataSet.pageSize}
              onChange={(page) => dataSet.page(page)}
            />
          </div>
        ) : renderListPage(dataSet)}
      </Spin>
    );
  }

  /**
   * @description: 列表
   * @param {*}
   * @return {*}
   */
  const renderListPage = (ds) => (
    <div className={`${cssPrefix}-listPage`}>
      <Table
        dataSet={ds}
        queryBar="none"
        showSelectionCachedButton={false}
        onRow={({ record }) => ({
          onMouseEnter: (e) => {
            if (record.get('programOwner')) {
              Tooltip.show(e.target, {
                title: '该用户为项目群人员，不支持批量操作',
              });
            }
          },
          onMouseLeave: () => {
            if (record.get('programOwner')) {
              Tooltip.hide();
            }
          },
        })}
      >
        <Table.Column
          width={100}
          name="realName"
          renderer={({ text }) => (
            <Tooltip title={text}>
              {text}
            </Tooltip>
          )}
        />
        <Table.Column
          width={50}
          renderer={({ record }) => handleRenderActionDom(
            permissions,
            record,
            record.toData(),
            true,
          )}
        />
        <Table.Column
          width={100}
          name="loginName"
          renderer={({ text }) => (
            <Tooltip title={text}>
              {text}
            </Tooltip>
          )}
        />
        <Table.Column width={100} name="enabled" renderer={({ value }) => <StatusTag name={value ? '启用' : '停用'} colorCode={value ? 'success' : ''} />} />
        <Table.Column
          width={150}
          name="role"
          renderer={({ record }) => expandMoreColumn({ record, customMaxTagCount: 1 })}
        />
        <Table.Column
          width={200}
          title={(
            <span>
              {formatCommon({ id: 'source' })}
              <NewTips
                helpText={(
                  <>
                    <p>【外部人员】指该成员账号注册时所属的组织不是当前组织。</p>
                    <p>【项目群人员】指该成员来自当前项目所属的项目群。</p>
                  </>
                )}
              />
            </span>
          )}
          renderer={({ record }) => (
            <>
              {label(record)}
              {programLabel(record)}
            </>
          )}
        />
        <Table.Column
          width={150}
          name="phone"
          renderer={({ text }) => (
            <Tooltip title={text}>
              {text}
            </Tooltip>
          )}
        />
        <Table.Column
          width={100}
          name="email"
          renderer={({ text }) => (
            <Tooltip title={text}>
              {text}
            </Tooltip>
          )}
        />
      </Table>
    </div>
  );

  const handleChangeSearch = async (data) => {
    dataSet.queryParameter = {};
    if (data && data.length > 0) {
      data.forEach((item) => {
        if (item.field) {
          dataSet.setQueryParameter(item.field, item.value?.value || item.value);
        } else {
          dataSet.setQueryParameter('params', item.value);
        }
      });
    }
    // dataSet.setQueryParameter('params', value);
    await dataSet.query();
  };

  return (
    <Page service={['choerodon.code.project.cooperation.team-member.ps.default']}>
      <Header
        title={
          formatProjectUser({ id: 'header.title' })
        }
      >
        <HeaderButtons
          showClassName={false}
          items={([{
            name: formatProjectUser({ id: 'addteammate' }),
            icon: 'person_add-o',
            display: true,
            permissions: ['choerodon.code.project.cooperation.team-member.ps.add'],
            handler: handleCreate,
          }, {
            name: formatProjectUser({ id: 'importteammate' }),
            icon: 'archive-o',
            display: true,
            permissions: ['choerodon.code.project.cooperation.team-member.ps.import'],
            handler: handleImportRole,
          }, {
            name: '批量操作',
            groupBtnItems: [{
              name: '批量添加角色',
              // 权限集
              service: [],
              handler: () => {
                Modal.open({
                  key: Modal.key(),
                  title: '批量添加角色',
                  children: (
                    <BatchAddRole
                      orgUserRoleDataSet={orgUserRoleDataSet}
                      orgRoleDataSet={orgRoleDataSet}
                      dataSet={dataSet}
                      afterAdd={() => handleSave()}
                    />
                  ),
                  drawer: true,
                  style: {
                    width: MIN,
                  },
                });
              },
            }, {
              // 权限集
              name: '批量删除',
              service: [],
              handler: () => {
                Modal.confirm({
                  title: '批量删除',
                  children: `是否删除已选的${dataSet.selected.length}个用户在本项目下的所有角色`,
                  okText: formatCommon({ id: 'delete' }),
                }).then(async (button) => {
                  if (button === 'ok') {
                    try {
                      dataSet.status = 'loading';
                      const userIds = dataSet.selected.map((item) => item.get('id'));
                      await usersApi.batchDelete(userIds);
                      await refresh();
                      dataSet.clearCachedSelected();
                    } catch (e) {
                      dataSet.status = 'ready';
                    }
                  }
                });
              },
            }],
            disabled: !(dataSet.selected && dataSet.selected.length > 1),
            display: mode === filterPageRef.current?.ModeList[1].value,
            permissions: [],
          }, getInitialButton() && {
            element: getInitialButton(),
          }, {
            icon: 'refresh',
            display: true,
            handler: () => {
              refresh();
            },
          }].filter(Boolean))}
        />
      </Header>
      <Breadcrumb
        {
        ...breadCrumb
        }
      />
      <DeleteRoleModal
        deleteRoleRecord={deleteRoleRecord}
        handleCancel={handleCancel}
        projectId={projectId}
      />
      <FilterPage
        cRef={filterPageRef}
        onSearchCallback={(value) => cRef.current.handleChangeSearch(value)}
        handelModeCallback={(v) => setMode(v)}
      />
      <Content
        className="project-user"
      >
        {
          renderNewContent()
        }
      </Content>
    </Page>
  );
}))({
  FF: () => import('./styles/ff.less'),
});

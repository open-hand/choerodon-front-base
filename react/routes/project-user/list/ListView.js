import React, {
  useContext, useState, Fragment, useImperativeHandle, useMemo, useEffect,
} from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  TextField,
  Table, Modal, message, Tooltip,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { StatusTag } from '@choerodon/components';
import {
  Action,
  Content,
  Header,
  axios,
  Permission,
  Breadcrumb,
  Page,
  HeaderButtons,
  checkPermission,
  BrowserAdapter,
} from '@choerodon/boot';
import {
  Spin, Button, Modal as OldModal, Icon,
} from 'choerodon-ui';
import some from 'lodash/some';
import expandMoreColumn from '../../../components/expandMoreColumn';
import DeleteRoleModal from '../DeleteRoleModal';
import Store from './stores';
import Sider from './sider';

import './index.less';

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

  const [deleteRoleRecord, setDeleteRoleRecord] = useState(undefined);
  const [permissions, setPermissions] = useState([{
    code: 'choerodon.code.project.cooperation.team-member.ps.update',
    approve: false,
  }, {
    code: 'choerodon.code.project.cooperation.team-member.ps.delete',
    approve: false,
  }]);

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

  useImperativeHandle(cRef, () => ({
    handleChangeSearch,
    renderUserName,
    renderAction,
    expandMoreColumn,
    rednerEnabled,
    renderNewContent,
  }));

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
          onOk={handleSave}
        />
      );
    }
    return null;
  }

  function handlePage(next) {
    if (next) {
      dataSet.nextPage();
    } else {
      dataSet.prePage();
    }
  }

  function handleRenderActionDom(selfPermissions, record, item) {
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
      <div className={`${styles['theme4-c7n-memberItem-action']} c7ncd-projectUser-action`}>
        <Action data={actionDatas} />
      </div>
    );
  }

  function renderNewContent() {
    return (
      <Spin wrapperClassName={styles['theme4-c7n-spin']} spinning={dataSet.status == 'loading'}>
        <div className={styles['theme4-c7n-member']}>
          {dataSet.toData().map((item) => (
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
                      // onClick={() => handleUserRole(item, true)}
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
                {label({ get: (key) => item[key] })}
                {programLabel({ get: (key) => item[key] })}
              </div>
            </div>
          ))}
          <div className={styles['theme4-c7n-member-page']}>
            <span
              role="none"
              onClick={() => handlePage(false)}
              className={classNames({
                [styles['theme4-c7n-member-page-disabled']]: dataSet.currentPage === 1,
                [styles['theme4-c7n-member-page-enabled']]: dataSet.currentPage > 1,
              })}
            >
              <Icon type="keyboard_arrow_left" />
            </span>
            <span
              role="none"
              style={{ marginLeft: 24 }}
              onClick={() => handlePage(true)}
              className={classNames({
                [styles['theme4-c7n-member-page-disabled']]: dataSet.currentPage === dataSet.totalPage,
                [styles['theme4-c7n-member-page-enabled']]: dataSet.currentPage < dataSet.totalPage,
              })}
            >
              <Icon type="keyboard_arrow_right" />
            </span>
          </div>
        </div>
      </Spin>
    );
  }

  const handleChangeSearch = (data) => {
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
    dataSet.query();
  };

  return (
    <Page service={['choerodon.code.project.cooperation.team-member.ps.default']}>
      <Header
        title={<FormattedMessage id={`${intlPrefix}.header.title`} />}
      >
        {getInitialButton()}
        <HeaderButtons
          showClassName={false}
          items={([{
            name: '添加团队成员',
            icon: 'person_add-o',
            display: true,
            permissions: ['choerodon.code.project.cooperation.team-member.ps.add'],
            handler: handleCreate,
          }, {
            name: '导入团队成员',
            icon: 'archive-o',
            display: true,
            permissions: ['choerodon.code.project.cooperation.team-member.ps.import'],
            handler: handleImportRole,
          }])}
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
      <Content
        className="project-user"
      >
        {
          renderNewContent()
          // render({
          //   dataSet,
          //   handleChangeSearch,
          //   renderUserName,
          //   renderAction,
          //   expandMoreColumn,
          //   rednerEnabled,
          //   renderNewContent,
          // })
        }
      </Content>
    </Page>
  );
}))({
  FF: () => import('./styles/ff.less'),
});

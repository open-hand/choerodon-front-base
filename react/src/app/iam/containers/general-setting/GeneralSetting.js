import React, {
  Component, useState, useContext, useEffect, Fragment, useMemo,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Divider } from 'choerodon-ui';
import { message, Modal, TextField } from 'choerodon-ui/pro';
import {
  axios, Content, Header, TabPage as Page, Breadcrumb, Permission, Choerodon,
} from '@choerodon/boot';
import queryString from 'query-string';
import getSearchString from '@choerodon/master/lib/containers/components/c7n/util/gotoSome';
import { FormattedMessage, injectIntl } from 'react-intl';
import GeneralSettingContext, { ContextProvider } from './stores';
import './GeneralSetting.less';
import '../../common/ConfirmModal.scss';

import Edit from './components/edit';

const GeneralSetting = observer(() => {
  const {
    store, AppState, intl: { formatMessage }, intlPrefix, prefixCls, history,
  } = useContext(GeneralSettingContext);
  const [editing, setEditing] = useState(false);
  const [categoryEnabled, setCategoryEnabled] = useState(false);
  const {
    id: projectId, name: projectName, organizationId, category: ProjectCategory,
  } = AppState.currentMenuType;
  const isOPERATIONS = useMemo(() => ProjectCategory === 'OPERATIONS', [ProjectCategory]);
  const loadEnableCategory = () => {
    axios.get('/iam/choerodon/v1/system/setting/enable_category')
      .then((response) => {
        setCategoryEnabled(response);
      });
  };

  const loadProject = () => axios.all([
    store.axiosGetProjectInfo(projectId),
    ProjectCategory === 'WATERFALL' ? store.axiosGetWaterfallProjectInfo(projectId) : undefined,
  ])
    .then(([data, waterfallData]) => {
      const newData = { ...data, waterfallData: waterfallData || {} };
      store.setImageUrl(data.imageUrl);
      store.setProjectInfo(newData);
      return newData;
    }).catch(Choerodon.handleResponseError);

  const loadProjectTypes = () => {
    store.loadProjectTypes().then((data) => {
      if (data.failed) {
        Choerodon.prompt(data.message);
      } else {
        store.setProjectTypes(data);
      }
    }).catch((error) => {
      Choerodon.handleResponseError(error);
    });
  };

  useEffect(() => {
    loadEnableCategory();
    loadProject();
    loadProjectTypes();
    return () => {
      store.setProjectInfo({});
      store.setImageUrl(null);
    };
  }, []);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  function handleDisable() {
    const { category, categories, name } = store.getProjectInfo;
    const isSubProject = categories.some((c) => c.code === 'PROGRAM_PROJECT');
    const okProps = {
      disabled: true,
      color: 'red',
      style: {
        width: '100%', border: '1px solid rgba(27,31,35,.2)', height: 36, marginTop: -26,
      },
    };
    const ModalContent = ({ modal }) => {
      let extraMessage;
      if (category === 'PROGRAM') {
        extraMessage = (
          <>
            <div className="c7n-projects-enable-tips">
              {formatMessage({ id: 'project.info.disable.program.tips' })}
            </div>
            <div style={{ marginTop: 10 }}>
              请输入
              {' '}
              <span style={{ fontWeight: 600 }}>{name}</span>
              {' '}
              来确认停用。
            </div>
            <TextField
              style={{ width: '100%', marginTop: 10 }}
              autoFocus
              onInput={(e) => {
                modal.update({
                  okProps: {
                    ...okProps,
                    disabled: e.target.value !== name,
                  },
                });
              }}
            />
          </>
        );
      } else if (isSubProject) {
        extraMessage = (
          <div className="c7n-projects-enable-tips">
            {formatMessage({ id: 'project.info.disable.subProject.tips' })}
          </div>
        );
      }
      const content = (
        <div style={{ marginTop: -10 }}>
          {category === 'PROGRAM' && (
            <p style={{
              marginBottom: 14,
              background: '#fffbdd',
              padding: '15px 26px',
              border: '1px solid rgba(27,31,35,.15)',
              width: 'calc(100% + 49px)',
              marginLeft: -25,
            }}
            >
              请仔细阅读下列事项！
            </p>
          )}
          <span>{formatMessage({ id: 'project.info.disable.content' }, { name: projectName })}</span>
          {extraMessage}
        </div>
      );
      return content;
    };
    if (category === 'PROGRAM') {
      Modal.open({
        className: 'c7n-iam-confirm-modal',
        title: formatMessage({ id: 'project.info.disable.program.title' }),
        children: <ModalContent />,
        okProps,
        okText: '我已经知道后果，停用此项目',
        closable: true,
        footer: (okBtn) => okBtn,
        // eslint-disable-next-line consistent-return
        onOk: async () => {
          try {
            const result = await axios.put(`/iam/choerodon/v1/organizations/${organizationId}/projects/${projectId}/disable`);
            if (result.failed) {
              throw result.message;
            } else {
              message.info('停用成功');
              history.push('/projects');
            }
          } catch (err) {
            return false;
          }
        },
      });
    } else {
      Modal.open({
        className: 'c7n-iam-confirm-modal',
        title: formatMessage({ id: 'project.info.disable.title' }),
        children: <ModalContent />,
        // eslint-disable-next-line consistent-return
        onOk: async () => {
          try {
            const result = await axios.put(`/iam/choerodon/v1/organizations/${organizationId}/projects/${projectId}/disable`);
            if (result.failed) {
              throw result.message;
            } else {
              message.info('停用成功');
              const queryObj = queryString.parse(history.location.search);
              const search = await getSearchString('organization', 'id', queryObj.organizationId);
              history.push(`/projects${search}`);
            }
          } catch (err) {
            message.error(err);
            return false;
          }
        },
      });
    }
  }

  const {
    enabled, name, code, agileProjectCode, categories = [], creationDate,
    createUserName, waterfallData = {},
  } = store.getProjectInfo;
  const {
    projectCode: waterfallProjectCode,
    projectConclusionTime, projectEstablishmentTime,
  } = waterfallData;
  const imageUrl = store.getImageUrl;
  return (
    <Page
      service={[
        'choerodon.code.project.setting.general-setting.ps.info',
      ]}
    >
      <Header title={<FormattedMessage id={`${intlPrefix}.header.title`} />}>

        <Permission service={['choerodon.code.project.setting.general-setting.ps.update']}>
          <Button
            icon="mode_edit"
            onClick={handleEditClick}
          >
            <FormattedMessage id="modify" />
          </Button>
        </Permission>
        <Permission service={['choerodon.code.project.setting.general-setting.ps.disable']}>
          <Button
            icon="remove_circle_outline"
            onClick={handleDisable}
          >
            <FormattedMessage id="disable" />
          </Button>
        </Permission>
      </Header>
      <Breadcrumb />
      <Content style={{ paddingTop: 0 }}>
        <div className={prefixCls}>
          <div style={{ display: 'flex' }}>
            <section className={`${prefixCls}-section`}>
              <div className={`${prefixCls}-section-content`}>
                <div className={`${prefixCls}-section-item`}>
                  <div className={`${prefixCls}-section-item-title`}>
                    {formatMessage({ id: `${intlPrefix}.name` })}
                  </div>
                  <div className={`${prefixCls}-section-item-content`}>
                    {name}
                  </div>
                </div>
                <div className={`${prefixCls}-section-item`}>
                  <div className={`${prefixCls}-section-item-title`}>
                    {formatMessage({ id: `${intlPrefix}.code` })}
                  </div>
                  <div className={`${prefixCls}-section-item-content`}>
                    {code}
                  </div>
                </div>
                <div className={`${prefixCls}-section-item`}>
                  <div className={`${prefixCls}-section-item-title`}>
                    {formatMessage({ id: `${intlPrefix}.category` })}
                  </div>
                  <div className={`${prefixCls}-section-item-content`}>
                    {(categories || []).map((c) => c.name).join(',')}
                  </div>
                </div>
                <div className={`${prefixCls}-section-item`}>
                  <div className={`${prefixCls}-section-item-title`}>
                    {formatMessage({ id: `${intlPrefix}.creationDate` })}
                  </div>
                  <div className={`${prefixCls}-section-item-content`}>
                    {creationDate}
                  </div>
                </div>
                <div className={`${prefixCls}-section-item`}>
                  <div className={`${prefixCls}-section-item-title`}>
                    {formatMessage({ id: `${intlPrefix}.creator` })}
                  </div>
                  <div className={`${prefixCls}-section-item-content`}>
                    {createUserName}
                  </div>
                </div>
              </div>
            </section>
            <section className={`${prefixCls}-section`} style={{ marginLeft: 100 }}>
              <div className={`${prefixCls}-section-content`}>
                <div className={`${prefixCls}-section-item`}>
                  <div className={`${prefixCls}-section-item-title`}>
                    {formatMessage({ id: `${intlPrefix}.avatar` })}
                  </div>
                  <div className={`${prefixCls}-section-item-content`}>
                    <div className="c7n-iam-generalsetting-avatar">
                      <div
                        className="c7n-iam-generalsetting-avatar-wrap"
                        style={{
                          backgroundColor: '#c5cbe8',
                          backgroundImage: imageUrl ? `url('${Choerodon.fileServer(imageUrl)}')` : '',
                        }}
                      >
                        {!imageUrl && name && name.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {
            !isOPERATIONS && (
              <>
                <Divider />
                <section className={`${prefixCls}-section`}>
                  <div className={`${prefixCls}-section-title`}>
                    {formatMessage({ id: `${intlPrefix}.otherSetting` })}
                  </div>
                  <div className={`${prefixCls}-section-content`}>
                    <div className={`${prefixCls}-section-item`}>
                      <div className={`${prefixCls}-section-item-title`}>
                        {formatMessage({ id: `${intlPrefix}.agile.prefix` })}
                      </div>
                      <div className={`${prefixCls}-section-item-content`}>
                        {waterfallProjectCode || agileProjectCode}
                      </div>
                    </div>
                    {ProjectCategory === 'WATERFALL'
                      ? [
                        <div className={`${prefixCls}-section-item`}>
                          <div className={`${prefixCls}-section-item-title`}>
                            {formatMessage({ id: `${intlPrefix}.waterfall.startTime` })}
                          </div>
                          <div className={`${prefixCls}-section-item-content`}>
                            {projectEstablishmentTime ? String(projectEstablishmentTime).split(' ')[0] : ''}
                          </div>
                        </div>,
                        <div className={`${prefixCls}-section-item`}>
                          <div className={`${prefixCls}-section-item-title`}>
                            {formatMessage({ id: `${intlPrefix}.waterfall.endTime` })}
                          </div>
                          <div className={`${prefixCls}-section-item-content`}>
                            {projectConclusionTime ? String(projectConclusionTime).split(' ')[0] : ''}
                          </div>
                        </div>] : null}
                  </div>
                </section>
              </>
            )
          }
        </div>
        <Edit
          visible={editing}
          onCancel={handleCancel}
          onRefresh={loadProject}
          projectCategory={ProjectCategory}
          categoryEnabled={categoryEnabled}
          isOPERATIONS={isOPERATIONS}
        />
      </Content>
    </Page>
  );
});

export default function Index(props) {
  return (
    <ContextProvider {...props}>
      <GeneralSetting />
    </ContextProvider>
  );
}

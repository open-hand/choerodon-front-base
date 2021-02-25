import React, {
  useCallback,
  useMemo,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Divider, Button } from 'choerodon-ui';
import {
  message, Modal, TextField, Form, Output, Spin,
} from 'choerodon-ui/pro';
import {
  Content, Header, TabPage as Page, Breadcrumb, Permission, Choerodon,
} from '@choerodon/boot';
import queryString from 'query-string';
import { map, some, compact } from 'lodash';
import getSearchString from '@choerodon/master/lib/containers/components/c7n/util/gotoSome';
import { FormattedMessage } from 'react-intl';
import { LabelAlign, LabelLayoutType } from '@/interface';
import { StoreProvider, useGeneralSettingContent } from './stores';
import EditProject from './components/edit-project';
import GeneralSettingServices from './services';

import './GeneralSetting.less';
import '../../common/ConfirmModal.scss';

const GeneralSetting = observer(() => {
  const {
    store,
    intl: { formatMessage },
    intlPrefix,
    prefixCls,
    history,
    infoDs,
    loadProject,
    showProjectPrefixArr,
    isShowAgilePrefix,
    isShowTestPrefix,
    isWATERFALL,
  } = useGeneralSettingContent();
  const record = useMemo(() => infoDs.current, [infoDs.current]);

  const handleOk = async () => {
    if (!record) {
      return false;
    }
    try {
      const organizationId = record.get('organizationId');
      const projectId = record.get('projectId');
      const result = await GeneralSettingServices.disableProject(organizationId, projectId);
      if (result && result.failed) {
        return false;
      }
      message.info('停用成功');
      const queryObj = queryString.parse(history.location.search);
      const search = await getSearchString('organization', 'id', queryObj.organizationId);
      history.push(`/projects${search}`);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleEditClick = () => {
    if (!record) {
      return;
    }
    Modal.open({
      key: Modal.key(),
      title: '修改信息',
      children: <EditProject
        refresh={loadProject}
        showProjectPrefixArr={showProjectPrefixArr}
        isWATERFALL={isWATERFALL}
        isShowAgilePrefix={isShowAgilePrefix}
        isShowTestPrefix={isShowTestPrefix}
        store={store}
        intlPrefix={intlPrefix}
        projectId={record.get('id')}
        projectData={record.toData()}
      />,
      drawer: true,
      style: { width: 380 },
      okText: formatMessage({ id: 'save' }),
    });
  };

  function handleDisable() {
    if (!record) {
      return;
    }
    const isSubProject = some(record.get('categories') || [], ['code', 'N_PROGRAM_PROJECT']);
    const isProgram = some(record.get('categories') || [], ['code', 'N_PROGRAM']);
    const name = record.get('name');
    const okProps = {
      disabled: true,
      color: 'red',
      style: {
        width: '100%', border: '1px solid rgba(27,31,35,.2)', height: 36, marginTop: -26,
      },
    };
    const ModalContent = ({ modal }: any) => {
      let extraMessage;
      if (isProgram) {
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
                    // @ts-ignore
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
          {isProgram && (
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
          <span>{formatMessage({ id: 'project.info.disable.content' }, { name })}</span>
          {extraMessage}
        </div>
      );
      return content;
    };
    if (isProgram) {
      Modal.open({
        className: 'c7n-iam-confirm-modal',
        title: formatMessage({ id: 'project.info.disable.program.title' }),
        children: <ModalContent />,
        okProps,
        okText: '我已经知道后果，停用此项目',
        closable: true,
        footer: (okBtn: any) => okBtn,
        onOk: handleOk,
      });
    } else {
      Modal.open({
        className: 'c7n-iam-confirm-modal',
        title: formatMessage({ id: 'project.info.disable.title' }),
        children: <ModalContent />,
        onOk: handleOk,
      });
    }
  }

  const renderCategories = useCallback(({ value }) => {
    const newCategories = map(value || [], ({ name, code }: { code: string, name: string }) => {
      if (code !== 'N_PROGRAM_PROJECT') {
        return name;
      }
      return null;
    });
    return compact(newCategories || []).join('，');
  }, []);

  if (!record) {
    return <Spin spinning />;
  }

  return (
    <Page
      service={['choerodon.code.project.setting.general-setting.ps.info']}
    >
      <Header>
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
      <Content className={prefixCls}>
        <div className={`${prefixCls}-content`}>
          <Form
            dataSet={infoDs}
            labelLayout={'horizontal' as LabelLayoutType}
            labelWidth={110}
            labelAlign={'left' as LabelAlign}
            className={`${prefixCls}-section`}
          >
            <Output name="name" />
            <Output name="code" />
            <Output name="categories" renderer={renderCategories} />
            <Output name="creationDate" />
            <Output name="createUserName" />
          </Form>
          <section className={`${prefixCls}-logo`}>
            <div className={`${prefixCls}-logo-title`}>
              {formatMessage({ id: `${intlPrefix}.avatar` })}
            </div>
            <div className={`${prefixCls}-logo-content`}>
              <div className={`${prefixCls}-avatar`}>
                <div
                  className={`${prefixCls}-avatar-wrap`}
                  style={{
                    backgroundColor: '#c5cbe8',
                    backgroundImage: record.get('imageUrl') ? `url('${Choerodon.fileServer(record.get('imageUrl'))}')` : '',
                  }}
                >
                  {!record.get('imageUrl') && record.get('name') && record.get('name').charAt(0)}
                </div>
              </div>
            </div>
          </section>
        </div>
        {
          showProjectPrefixArr.length > 0 && (
            <>
              <Divider />
              <div className={`${prefixCls}-section-title`}>
                <FormattedMessage id={`${intlPrefix}.otherSetting`} />
              </div>
              <Form
                dataSet={infoDs}
                labelWidth={110}
                labelLayout={'horizontal' as LabelLayoutType}
                labelAlign={'left' as LabelAlign}
                className={`${prefixCls}-section`}
              >
                {isShowAgilePrefix ? <Output name="agileProjectCode" renderer={({ value }) => record.get('waterfallProjectCode') || value} /> : null}
                {isShowTestPrefix ? <Output name="testProjectCode" /> : null}
                {isWATERFALL ? ([
                  <Output name="projectEstablishmentTime" renderer={({ value }) => (value ? String(value).split(' ')[0] : '')} />,
                  <Output name="projectConclusionTime" renderer={({ value }) => (value ? String(value).split(' ')[0] : '')} />,
                ]) : null}
              </Form>
            </>
          )
        }
      </Content>
    </Page>
  );
});

export default function Index(props: any) {
  return (
    <StoreProvider {...props}>
      <GeneralSetting />
    </StoreProvider>
  );
}

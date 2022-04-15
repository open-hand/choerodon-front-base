/* eslint-disable react/jsx-no-bind */
import React, { useContext, Fragment } from 'react';
import {
  axios, Content, Header, Page, Breadcrumb, TabPage, PageWrap, PageTab, HeaderButtons,
} from '@choerodon/boot';
import {
  Form, Output, Modal,
} from 'choerodon-ui/pro';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useFormatMessage } from '@choerodon/master';
import { mapping as systemMapping } from '../stores/SystemSettingDataSet';
import GitlabSync from './components/gitlab-sync';
import SketchPicker from './components/sketchPicker';
import LoginIndex from './tabs/loginIndex';
import { mapping } from '../stores/FuncModeDataSet';
import './index.less';
import InfoForm from './InfoForm';

import Store from '../stores';

const modalKey = Modal.key();

const basicInfo = withRouter(observer(() => {
  const {
    systemSettingDataSet: dataSet,
    AppState, intl, intlPrefix, presetColors, colorMap, hasRegister, format,
    formatCommon,
  } = useContext(Store);

  const favicon = dataSet.current && dataSet.current.getPristineValue('favicon');
  const systemLogo = dataSet.current && dataSet.current.getPristineValue('systemLogo');
  const themeColor = dataSet.current && dataSet.current.getPristineValue('themeColor');
  async function handleSave() {
    try {
      if ((await dataSet.submit())) {
        setTimeout(() => { window.location.reload(true); }, 1000);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  function handleCancel() {
    dataSet.reset();
    return true;
  }
  function openModal() {
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '修改信息',
      style: { width: 380 },
      children: (
        <InfoForm intl={intl} dataSet={dataSet} AppState={AppState} hasRegister={hasRegister} />
      ),
      fullScreen: true,
      onOk: handleSave,
      okText: '保存',
      onCancel: handleCancel,
    });
  }

  function openThemeColorModal() {
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '修改主题色',
      style: { width: 380 },
      children: (
        <SketchPicker
          presetColors={presetColors}
          colorMap={colorMap}
          dataSet={dataSet}
          themeColor={(themeColor && themeColor.split(',')[0]) || '#5365EA'}
        />
      ),
      fullScreen: true,
      onOk: handleSave,
      okText: '保存',
      onCancel: handleCancel,
    });
  }
  function handleReset() {
    Modal.open({
      key: Modal.key(),
      title: intl.formatMessage({ id: `${intlPrefix}.reset.confirm.title` }),
      children: intl.formatMessage({ id: `${intlPrefix}.reset.confirm.content` }),
      onOk: async () => {
        try {
          await axios.delete('/iam/choerodon/v1/system/setting');
          await window.location.reload(true);
          return true;
        } catch (e) {
          return false;
        }
      },
    });
  }
  function renderThemeColor({ value }) {
    return (
      <div style={{
        width: '.2rem', height: '.2rem', background: ((value && value.split(',')[0]) || '#3F51B5'), marginTop: '.05rem', borderRadius: '.02rem',
      }}
      />
    );
  }

  function renderBoolean({ value }) {
    return value === true ? '是' : '否';
  }
  return (
    <TabPage service={['choerodon.code.site.setting.general-setting.ps.default']}>
      <Header>
        <HeaderButtons
          items={([{
            name: format({ id: 'editInfo' }),
            icon: 'edit-o',
            display: true,
            permissions: ['choerodon.code.site.setting.general-setting.ps.update'],
            handler: openModal,
          }, {
            name: format({ id: 'editThemeColor' }),
            icon: 'edit-o',
            display: true,
            permissions: ['choerodon.code.site.setting.general-setting.ps.update.theme'],
            handler: openThemeColorModal,
          }, {
            name: formatCommon({ id: 'reset' }),
            icon: 'swap_horiz',
            display: true,
            permissions: ['choerodon.code.site.setting.general-setting.ps.reset'],
            handler: handleReset,
          }])}
          showClassName={false}
        />
      </Header>

      <Breadcrumb />

      <Content>
        <div className="c7n-system-setting-form">
          <Form
            pristine
            labelWidth={190}
            dataSet={dataSet}
            labelLayout="horizontal"
            labelAlign="left"
            columns={2}
          >
            <Output name="systemName" colSpan={1} />

            <div colSpan={1} rowSpan={3} className="c7n-system-setting-formImg" label={format({ id: 'platformLogo' })}>
              {favicon ? <img src={favicon} alt="图片" />
                : <div className="c7n-system-setting-formImg-wrapper default-favicon" />}
            </div>
            <Output name="systemTitle" newLine />
            <Output renderer={() => '简体中文'} name="defaultLanguage" newLine />
            <Output renderer={() => (dataSet.current && dataSet.current.getPristineValue('resetGitlabPasswordUrl')) || '无'} name="resetGitlabPasswordUrl" />
            <div colSpan={1} rowSpan={3} className="c7n-system-setting-formImg" label={format({ id: 'platformNavigationBar' })}>
              {systemLogo ? <img src={systemLogo} alt="图片" />
                : <div className="c7n-system-setting-formImg-wrapper default-logo" />}
            </div>
            {hasRegister && (
              <Output renderer={renderBoolean} name="registerEnabled" newLine />
            )}
            {hasRegister && dataSet.current && dataSet.current.getPristineValue('registerEnabled') && (
              <Output renderer={() => (dataSet.current && dataSet.current.getPristineValue('registerUrl')) || '无'} name="registerUrl" />
            )}
            <Output renderer={renderBoolean} name={systemMapping.openAppMarket.name} label={format({ id: 'isStartOpenAppMarket' })} />
            <Output renderer={renderBoolean} name="autoCleanEmailRecord" newLine label={format({ id: 'isAutoCleanEmailLog' })} />
            <Output renderer={renderBoolean} name="autoCleanWebhookRecord" newLine label={format({ id: 'isAutoCleanWebhookLog' })} />
            <Output renderer={renderBoolean} name="autoCleanSagaInstance" newLine label={format({ id: 'isAutoCleanRecords' })} />
          </Form>
        </div>

        <div className="c7n-system-setting-form">
          <h3>{format({ id: 'themeColor' })}</h3>
          <div className="divider" />
          <Form
            pristine
            labelWidth={180}
            dataSet={dataSet}
            labelLayout="horizontal"
            labelAlign="left"
          >
            <Output renderer={renderThemeColor} name="themeColor" />
          </Form>
        </div>
      </Content>
    </TabPage>
  );
}));

const funcMode = withRouter(observer(() => {
  const {
    FuncModeDataSet,
    format,
    formatCommon,
  } = useContext(Store);

  const handleClickSync = () => {
    Modal.open({
      key: Modal.key(),
      title: format({ id: 'gitlabUserSync' }),
      drawer: true,
      children: <GitlabSync />,
      style: {
        width: 'calc(100% - 3.5rem)',
      },
      okText: '手动同步',
    });
  };

  return (
    <TabPage>
      <Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: format({ id: 'gitlabUserSync' }),
            icon: 'refresh',
            display: true,
            handler: handleClickSync,
          }])}
        />
      </Header>
      <Breadcrumb />
      <Content>
        <Form labelWidth={210} className="c7ncd-func-form" labelLayout="horizontal" dataSet={FuncModeDataSet} columns={1}>
          <Output name={mapping.isInstallMission.name} colSpan={1} label={format({ id: 'isInstallTaskManagement' })} />
          <Output name={mapping.isInstallDevops.name} colSpan={1} label={format({ id: 'isInstallDevopsManagement' })} />
          <Output name={mapping.isInstallTest.name} colSpan={1} label={format({ id: 'isInstallTestManagement' })} />
        </Form>
      </Content>
    </TabPage>
  );
}));

const InfoView = observer(() => {
  const format = useFormatMessage('c7n.system-setting');
  return (
    <Page>
      <PageWrap noHeader={[]} cache>
        <PageTab
          title={format({ id: 'basicInfo' })}
          tabKey="baseInfo"
          component={basicInfo}
          alwaysShow
        />
        <PageTab
          title={format({ id: 'loginIndex' })}
          tabKey="loginIndex"
          component={LoginIndex}
          alwaysShow
        />
        <PageTab
          title={format({ id: 'functionModule' })}
          tabKey="function"
          component={funcMode}
          alwaysShow
        />
      </PageWrap>
    </Page>
  );
});
export default withRouter(InfoView);

/* eslint-disable max-len */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { ModalContainer } from 'choerodon-ui/pro';
import { asyncLocaleProvider, NoMatch } from '@choerodon/boot';
import { PermissionRoute, useCurrentLanguage } from '@choerodon/master';

import './style/index.less';

// global 对应目录
const siteSetting = React.lazy(() => import('./routes/site-setting'));
const rootUser = React.lazy(() => import('./routes/root-user'));

// organization
const orgRole = React.lazy(() => import('./routes/org-role'));
const orguser = React.lazy(() => import('./routes/org-user'));
const organizationSetting = React.lazy(() => import('./routes/organization/organization-setting'));
const orgSafe = React.lazy(() => import('./routes/safe/org-safe'));
const siteSafe = React.lazy(() => import('./routes/safe/site-safe'));
const orgAdmin = React.lazy(() => import('./routes/org-admin'));
const orgClient = React.lazy(() => import('./routes/client/route'));
const orgMsgLog = React.lazy(() => import('./routes/org-message-log'));

// project
const generalSetting = React.lazy(() => import('./routes/general-setting'));
const projectUser = React.lazy(() => import('./routes/project-user'));
// const applicationSetting = asyncRouter(() => import('./routes/application-setting'));
// const applicationManagement = asyncRouter(() => import('./routes/application-management'));

// user
// const tokenManager = asyncRouter(() => import('./routes/user/token-manager'));
const userInfo = React.lazy(() => import('./routes/user/user-info'));
const permissionInfo = React.lazy(() => import('./routes/user/permission-info'));

// saga 事务管理
// const saga = asyncRouter(() => import('./routes/saga/saga'));
// const sagaInstance = asyncRouter(() => import('./routes/saga/saga-instance'));

// 应用市场
// const AppRelease = asyncRouter(() => import('./routes/market/MarketRelease'));
// const AppMarket = asyncRouter(() => import('./routes/market/AppMarket'));

// lookup配置
// const lookupConfig = asyncRouter(() => import('./routes/lookup-config'));

// lov配置
// const lovConfig = asyncRouter(() => import('./routes/lov-config'));

// 多语言配置
// const langConfig = asyncRouter(() => import('./routes/lang-config'));

const orgOverview = React.lazy(() => import('./routes/org-overview'));

const platformOverview = React.lazy(() => import('./routes/platform-overview'));

const heroPage = React.lazy(() => import('./routes/hzero-page'));

const orgPinelineTemplate = React.lazy(() => import('./routes/org-pipeline-template'));

// 收集企业信息
const enterpriseInfo = React.lazy(() => import('./routes/enterprises-info'));
const IAMIndex = () => {
  const match = useRouteMatch();
  const langauge = useCurrentLanguage();
  const IntlProviderAsync = asyncLocaleProvider(langauge, () => import(`./locale/${langauge}`));
  return (
    <IntlProviderAsync>
      <div className="c7ncd-base-root">
        <Switch>
          <Route path={`${match.url}/system-setting`} component={siteSetting} />
          <Route path={`${match.url}/org-role`} component={orgRole} />
          <Route path={`${match.url}/root-user`} component={rootUser} />
          <Route
            path={`${match.url}/team-member`}
            component={projectUser}
          />
          <Route path={`${match.url}/org-user`} component={orguser} />
          <Route path={`${match.url}/project-setting/info`} component={generalSetting} />
          <Route path={`${match.url}/user-info`} component={userInfo} />
          <Route path={`${match.url}/permission-info`} component={permissionInfo} />
          <Route path={`${match.url}/org-pipeline-template`} component={orgPinelineTemplate} />
          <PermissionRoute
            path={`${match.url}/organization-setting`}
            component={organizationSetting}
            service={[
              'choerodon.code.organization.setting.general-setting.ps.info',
              'choerodon.code.organization.setting.general-setting.ps.ldap',
              'choerodon.code.organization.setting.general-setting.ps.working-calendar',
            ]}
          />
          <Route path={`${match.url}/org-safe`} component={orgSafe} />
          <Route path={`${match.url}/safe`} component={siteSafe} />
          <Route path={`${match.url}/client`} component={orgClient} />
          <Route path={`${match.url}/pro-client`} component={orgClient} />
          <PermissionRoute
            path={`${match.url}/org-msg-log`}
            component={orgMsgLog}
            service={[
              'choerodon.code.organization.manager.msglog.ps.default',
            ]}
          />
          <Route path={`${match.url}/org-admin`} component={orgAdmin} />
          <Route path={`${match.url}/org-overview`} component={orgOverview} />
          <Route path={`${match.url}/platform-overview`} component={platformOverview} />
          <Route path={`${match.url}/hzero/user`} component={heroPage} />
          <Route path={`${match.url}/hzero/role`} component={heroPage} />
          <Route path={`${match.url}/hzero/menu`} component={heroPage} />
          <Route path={`${match.url}/hzero/instance`} component={heroPage} />
          <Route path={`${match.url}/hzero/api-test`} component={heroPage} />
          <Route path={`${match.url}/hzero/api`} component={heroPage} />
          <Route path={`${match.url}/enterprise`} component={enterpriseInfo} />
          <Route path="*" component={NoMatch} />
        </Switch>
        <ModalContainer />
      </div>
    </IntlProviderAsync>
  );
};

export default IAMIndex;

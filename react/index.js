/* eslint-disable max-len */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';
import { ModalContainer } from 'choerodon-ui/pro';
import { asyncLocaleProvider, asyncRouter, nomatch } from '@choerodon/boot';
import { PermissionRoute } from '@choerodon/master';

import './style/index.less';

// global 对应目录
const siteSetting = asyncRouter(() => import('./routes/site-setting'));
// const menuSetting = asyncRouter(() => import('./routes/global/menu-setting'));
// const role = asyncRouter(() => import('./routes/role'));
// const siteUser = asyncRouter(() => import('./routes/site-user'));
const rootUser = asyncRouter(() => import('./routes/root-user'));

// organization
const orgRole = asyncRouter(() => import('./routes/org-role'));
const orgUser = asyncRouter(() => import('./routes/org-user'));
const organizationSetting = asyncRouter(() => import('./routes/organization/organization-setting'));
const orgSafe = asyncRouter(() => import('./routes/safe/org-safe'));
const siteSafe = asyncRouter(() => import('./routes/safe/site-safe'));
const orgAdmin = asyncRouter(() => import('./routes/org-admin'));
const orgClient = asyncRouter(() => import('./routes/client/route'));

// project
const generalSetting = asyncRouter(() => import('./routes/general-setting'));
const projectUser = asyncRouter(() => import('./routes/project-user'));
// const applicationSetting = asyncRouter(() => import('./routes/application-setting'));
// const applicationManagement = asyncRouter(() => import('./routes/application-management'));

// user
// const tokenManager = asyncRouter(() => import('./routes/user/token-manager'));
const userInfo = asyncRouter(() => import('./routes/user/user-info'));
const permissionInfo = asyncRouter(() => import('./routes/user/permission-info'));

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

const orgOverview = asyncRouter(() => import('./routes/org-overview'));

const platformOverview = asyncRouter(() => import('./routes/platform-overview'));

const heroPage = asyncRouter(() => import('./routes/hzero-page'));

// 收集企业信息
const enterpriseInfo = asyncRouter(() => import('./routes/enterprises-info'));

@inject('AppState')
class IAMIndex extends React.Component {
  render() {
    const { match, AppState } = this.props;
    const langauge = AppState.currentLanguage;
    const IntlProviderAsync = asyncLocaleProvider(langauge, () => import(`./locale/${langauge}`));
    return (
      <IntlProviderAsync>
        <div className="c7ncd-base-root">
          <Switch>
            {/* <Route path={`${match.url}/menu-setting`} component={menuSetting} /> */}
            {/* <Route path={`${match.url}/general-setting`} component={generalSetting} /> */}
            {/* <Route path={`${match.url}/role`} component={role} /> */}
            {/* <Route path={`${match.url}/user`} component={siteUser} /> */}
            {/* <Route path={`${match.url}/application-setting`} component={applicationSetting} /> */}
            {/* <Route path={`${match.url}/token-manager`} component={tokenManager} /> */}
            {/* <Route path={`${match.url}/saga`} component={saga} /> */}
            {/* <Route path={`${match.url}/saga-instance`} component={sagaInstance} /> */}
            {/* <Route path={`${match.url}/market-publish`} component={AppRelease} /> */}
            {/* <Route path={`${match.url}/app-market`} component={AppMarket} /> */}
            {/* <Route path={`${match.url}/application-management`} component={applicationManagement} /> */}
            {/* <Route path={`${match.url}/lookup-config`} component={lookupConfig} /> */}
            {/* <Route path={`${match.url}/lang-config`} component={langConfig} /> */}
            {/* <Route path={`${match.url}/lov-config`} component={lovConfig} /> */}
            <Route path={`${match.url}/system-setting`} component={siteSetting} />
            <Route path={`${match.url}/org-role`} component={orgRole} />
            <Route path={`${match.url}/root-user`} component={rootUser} />
            <Route path={`${match.url}/team-member`} component={projectUser} />
            <Route path={`${match.url}/org-user`} component={orgUser} />
            <Route path={`${match.url}/project-setting/info`} component={generalSetting} />
            <Route path={`${match.url}/user-info`} component={userInfo} />
            <Route path={`${match.url}/permission-info`} component={permissionInfo} />
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
            <Route path="*" component={nomatch} />
          </Switch>
          <ModalContainer />
        </div>
      </IntlProviderAsync>
    );
  }
}

export default IAMIndex;

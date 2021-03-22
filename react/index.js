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
const orgClient = asyncRouter(() => import('./routes/client'));

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
            <PermissionRoute path={`${match.url}/org-role`} component={orgRole} service={['choerodon.code.organization.manager.role.ps.default']} />
            <PermissionRoute path={`${match.url}/root-user`} component={rootUser} service={['choerodon.code.site.manager.root-user.ps.default']} />
            <PermissionRoute path={`${match.url}/team-member`} component={projectUser} service={['choerodon.code.project.cooperation.team-member.ps.default']} />
            <PermissionRoute path={`${match.url}/org-user`} component={orgUser} service={['choerodon.code.organization.manager.user.ps.default']} />
            <Route path={`${match.url}/project-setting/info`} component={generalSetting} />
            <Route path={`${match.url}/user-info`} component={userInfo} />
            <Route path={`${match.url}/permission-info`} component={permissionInfo} />
            <Route path={`${match.url}/organization-setting`} component={organizationSetting} />
            <Route path={`${match.url}/org-safe`} component={orgSafe} />
            <Route path={`${match.url}/safe`} component={siteSafe} />
            <PermissionRoute path={`${match.url}/client`} component={orgClient} service={['choerodon.code.organization.setting.client.ps.default']} />
            <PermissionRoute path={`${match.url}/pro-client`} component={orgClient} service={['choerodon.code.project.setting.client.ps.default']} />
            <PermissionRoute path={`${match.url}/org-admin`} component={orgAdmin} service={['choerodon.code.organization.manager.organization-admin.ps.default']} />
            <PermissionRoute path={`${match.url}/org-overview`} component={orgOverview} service={['choerodon.code.organization.manager.overview.ps.default']} />
            <PermissionRoute path={`${match.url}/platform-overview`} component={platformOverview} service={['choerodon.code.site.manager.platform-overview.ps.default']} />
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

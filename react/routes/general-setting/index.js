import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import {
  asyncRouter, nomatch, PageWrap, PageTab,
} from '@choerodon/boot';
import { PermissionRoute } from '@choerodon/master';

import GeneralSetting from './GeneralSetting';
import ApplicationSetting from '../application-setting/ApplicationSetting';

const TabIndex = () => (
  <PageWrap noHeader={[]} cache>
    <PageTab title="项目信息" tabKey="choerodon.code.project.general-info" component={withRouter(GeneralSetting)} alwaysShow />
    {/* <PageTab title="应用配置" tabKey="choerodon.code.project.general-application" component={withRouter(ApplicationSetting)} /> */}
  </PageWrap>
);
const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={TabIndex}
      service={['choerodon.code.project.setting.general-setting.ps.info']}
    />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

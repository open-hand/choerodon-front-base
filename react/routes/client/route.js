import React from 'react';
import { Route, Switch } from 'react-router';
import { PermissionRoute } from '@choerodon/master';
import { asyncRouter, NoMatch } from '@choerodon/boot';

const Content = asyncRouter(() => import('./index'));

const service = {
  organization: ['choerodon.code.organization.setting.client.ps.default'],
  project: ['choerodon.code.project.setting.client.ps.default'],
};

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={Content}
      service={(type) => service[type] || []}
    />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

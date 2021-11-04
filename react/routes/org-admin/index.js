import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, NoMatch } from '@choerodon/boot';
import { PermissionRoute } from '@choerodon/master';

const List = asyncRouter(() => import('./list'));

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={List}
      service={['choerodon.code.organization.manager.organization-admin.ps.default']}
    />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

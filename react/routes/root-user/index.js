import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';
import { PermissionRoute } from '@choerodon/master';

const List = asyncRouter(() => import('./list'));

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={List}
      service={['choerodon.code.site.manager.root-user.ps.default']}
    />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

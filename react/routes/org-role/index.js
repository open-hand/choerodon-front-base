import React from 'react';
import { Route, Switch } from 'react-router';
import { PermissionRoute } from '@choerodon/master';
import { NoMatch } from '@choerodon/boot';
import ListView from './ListView';
import { StoreProvider } from './stores';

const RoleIndex = (props) => (
  <StoreProvider {...props}>
    <ListView />
  </StoreProvider>
);

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={RoleIndex}
      service={['choerodon.code.organization.manager.role.ps.default']}
    />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

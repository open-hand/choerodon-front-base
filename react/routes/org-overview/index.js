import React from 'react';
import { Route, Switch } from 'react-router';
import { PermissionRoute } from '@choerodon/master';
import { nomatch } from '@choerodon/boot';
import OrgOverview from './OrgOverview';
import { StoreProvider } from './stores';

const ContentIndex = (props) => (
  <StoreProvider {...props}>
    <OrgOverview />
  </StoreProvider>
);

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={ContentIndex}
      service={['choerodon.code.organization.manager.overview.ps.default']}
    />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

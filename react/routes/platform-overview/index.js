import React from 'react';
import { Route, Switch } from 'react-router';
import { PermissionRoute } from '@choerodon/master';
import { NoMatch } from '@choerodon/boot';
import PlatformOverview from './PlatformOverview';
import { StoreProvider } from './stores';

const ContentIndex = (props) => (
  <StoreProvider {...props}>
    <PlatformOverview />
  </StoreProvider>
);

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={ContentIndex}
      service={['choerodon.code.site.manager.platform-overview.ps.default']}
    />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

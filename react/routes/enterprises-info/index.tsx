import React from 'react';
import { NoMatch, asyncRouter } from '@choerodon/boot';
import { Route, Switch } from 'react-router-dom';
import { StoreProvider } from './stores';

const Content = asyncRouter(() => import('./Content'));
const agreement = asyncRouter(() => import('./agreement'));

const HostConfigIndex = ({ match }: any) => (
  <StoreProvider>
    <Switch>
      <Route exact path={match.url} component={Content} />
      <Route exact path={`${match.url}/agreement`} component={agreement} />
      <Route path="*" component={NoMatch} />
    </Switch>
  </StoreProvider>
);

export default HostConfigIndex;

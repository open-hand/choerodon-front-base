import React from 'react';
import { nomatch, asyncRouter } from '@choerodon/boot';
import { Route, Switch } from 'react-router-dom';
import { StoreProvider } from './stores';

const Content = asyncRouter(() => import('./Content'));
const agreement = asyncRouter(() => import('./agreement/index'));

const HostConfigIndex = ({ match }: any) => (
  <StoreProvider>
    <Switch>
      <Route exact path={match.url} component={Content} />
      <Route exact path={`${match.url}/agreement`} component={agreement} />
      <Route path="*" component={nomatch} />
    </Switch>
  </StoreProvider>
);

export default HostConfigIndex;

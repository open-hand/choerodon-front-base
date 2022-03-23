import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter } from '@choerodon/boot';
import './index.less';
import { StoreProvider } from './stores';

const TabPage = asyncRouter(() => import('./TabPage'));
const SyncRecord = asyncRouter(() => import('./sync-record'));

const Index = (props) => (
  // eslint-disable-next-line no-undef
  <StoreProvider {...props}>
    <Switch>
      {/* eslint-disable-next-line */}
      <Route component={SyncRecord} path={`${props.match.url}/sync-record`} />
      {/* eslint-disable-next-line */}
      <Route component={TabPage} path={props.match.url} />
    </Switch>
  </StoreProvider>
);

export default Index;

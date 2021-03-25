import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from '@choerodon/boot';
import { PermissionRoute } from '@choerodon/master';
import { StoreProvider } from './stores';

import './index.less';

const BasicInfo = asyncRouter(() => import('./basic-info'));

const BasicInfoIndex = (props) => (
  <StoreProvider {...props}>
    <BasicInfo />
  </StoreProvider>
);

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={BasicInfoIndex}
      service={['choerodon.code.site.setting.general-setting.ps.default']}
    />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

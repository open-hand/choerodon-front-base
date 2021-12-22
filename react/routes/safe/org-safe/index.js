import React from 'react';
import { PageWrap, PageTab, NoMatch } from '@choerodon/boot';
import { Route, Switch } from 'react-router';
import { PermissionRoute } from '@choerodon/master';
import { StoreProvider } from './store';
import Password from './password';

import './index.less';

function TabIndex(props) {
  return (
    <StoreProvider {...props}>
      <Password />
    </StoreProvider>
  );
}

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      path={match.url}
      component={TabIndex}
      service={['choerodon.code.organization.setting.security.ps.password-policy']}
    />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

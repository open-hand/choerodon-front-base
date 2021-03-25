import React from 'react';
import { PageWrap, PageTab, nomatch } from '@choerodon/boot';
import { Route, Switch } from 'react-router';
import { PermissionRoute } from '@choerodon/master';
import { StoreProvider } from './store';
import PasswordPolicy from './password';

function TabIndex(props) {
  return (
    <StoreProvider {...props}>
      <PageWrap cache noHeader={[]}>
        <PageTab alwaysShow title="密码策略" tabKey="choerodon.code.site.security-password" component={PasswordPolicy} />
      </PageWrap>
    </StoreProvider>
  );
}

const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={TabIndex}
      service={['choerodon.code.site.setting.security.ps.password-policy']}
    />
    <Route path="*" component={nomatch} />
  </Switch>
);

export default Index;

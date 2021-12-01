import React from 'react';
import { PageWrap, PageTab, NoMatch } from '@choerodon/boot';
import { Route, Switch } from 'react-router';
import { PermissionRoute, useFormatMessage } from '@choerodon/master';
import { StoreProvider } from './store';
import PasswordPolicy from './password';

function TabIndex(props) {
  const format = useFormatMessage('c7n.safe');
  return (
    <StoreProvider {...props}>
      <PageWrap cache noHeader={[]}>
        <PageTab alwaysShow title={format({ id: 'passwordPolicy' })} tabKey="choerodon.code.site.security-password" component={PasswordPolicy} />
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
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

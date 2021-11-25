import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import {
  NoMatch, PageWrap, PageTab, useFormatMessage, PermissionRoute,
} from '@choerodon/master';

import GeneralSetting from './GeneralSetting';

const TabIndex = () => {
  const formatProjectInfo = useFormatMessage('c7ncd.project.setting.info');
  return (
    <PageWrap noHeader={[]} cache>
      <PageTab title={formatProjectInfo({ id: 'header.title' })} tabKey="choerodon.code.project.general-info" component={withRouter(GeneralSetting)} alwaysShow />
    </PageWrap>
  );
};
const Index = ({ match }) => (
  <Switch>
    <PermissionRoute
      exact
      path={match.url}
      component={TabIndex}
      service={['choerodon.code.project.setting.general-setting.ps.info']}
    />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;


import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, NoMatch } from '@choerodon/boot';
import { withRouter } from 'react-router-dom';
import ApplicationSetting from './ApplicationSetting';

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={ApplicationSetting} />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

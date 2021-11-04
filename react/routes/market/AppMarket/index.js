import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, NoMatch } from '@choerodon/boot';

const mainPage = asyncRouter(() => import('./PaaSMarket'));
const appDetail = asyncRouter(() => import('./PaaSMarket/AppDetail'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={mainPage} />
    <Route exact path={`${match.url}/:id`} component={appDetail} />
    <Route exact path={`${match.url}/category/:id`} component={mainPage} />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

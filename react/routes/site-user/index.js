import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, NoMatch } from '@choerodon/boot';

const List = asyncRouter(() => import('./list'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={List} />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

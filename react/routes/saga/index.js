
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, NoMatch } from '@choerodon/boot';

const SagaIndex = asyncRouter(() => import('./saga'));

const Index = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={SagaIndex} />
    <Route path="*" component={NoMatch} />
  </Switch>
);

export default Index;

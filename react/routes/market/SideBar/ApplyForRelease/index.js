import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, NoMatch } from '@choerodon/boot';
import { StoreProvider } from './Store';
import ApplyForRelease from './ApplyForRelease';

const Index = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <StoreProvider {...props}>
    <ApplyForRelease />
  </StoreProvider>
);

export default Index;

import React from 'react';
import { StoreProvider } from './stores';
import Content from './ApplicationTemplate';

export default (props) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

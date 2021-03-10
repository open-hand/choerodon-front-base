import React from 'react';
import { StoreProvider } from './stores';
import Content from './AddTemplate';

export default (props) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

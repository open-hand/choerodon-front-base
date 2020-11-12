import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';

const HostConfigIndex = (props: any) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default HostConfigIndex;

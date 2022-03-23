import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import './index.less';

export interface IndexProps {

}

const Index = (props: IndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default Index;

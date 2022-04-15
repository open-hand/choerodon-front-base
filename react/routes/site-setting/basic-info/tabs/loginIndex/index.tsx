import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import './index.less';

export interface Iprops {

}

const Index = (props: Iprops) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default Index;

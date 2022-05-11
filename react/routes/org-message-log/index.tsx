import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';

export interface IndexProps {

}

const Index = (props: IndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default Index;

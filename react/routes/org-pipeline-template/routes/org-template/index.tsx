import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';

const orgPipelineTemplateIndex = (props: any) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default orgPipelineTemplateIndex;

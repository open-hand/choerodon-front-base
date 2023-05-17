import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  ModifyPipelineClassIndexProps,
} from './interface';
import './index.less';

const ModifyPipelineClassIndex = (props: ModifyPipelineClassIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default ModifyPipelineClassIndex;

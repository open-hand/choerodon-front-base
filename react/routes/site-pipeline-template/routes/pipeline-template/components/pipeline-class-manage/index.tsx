import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  PipelineClassManageIndexProps,
} from './interface';
import './index.less';

const PipelineClassManageIndex = (props: PipelineClassManageIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default PipelineClassManageIndex;

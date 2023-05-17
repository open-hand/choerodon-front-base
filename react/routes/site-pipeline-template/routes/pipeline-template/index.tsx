import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  PipelineTemplateIndexProps,
} from './interface';
import './index.less';

const PipelineTemplateIndex = (props: PipelineTemplateIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default PipelineTemplateIndex;

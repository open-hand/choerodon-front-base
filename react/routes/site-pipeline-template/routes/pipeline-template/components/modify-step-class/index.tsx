import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  ModifyStepClassIndexProps,
} from './interface';
import './index.less';

const ModifyStepClassIndex = (props: ModifyStepClassIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default ModifyStepClassIndex;

import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  StepClassManageIndexProps,
} from './interface';
import './index.less';

const StepClassManageIndex = (props: StepClassManageIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default StepClassManageIndex;

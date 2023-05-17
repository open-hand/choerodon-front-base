import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  ModifyTaskGroupIndexProps,
} from './interface';
import './index.less';

const ModifyTaskGroupIndex = (props: ModifyTaskGroupIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default ModifyTaskGroupIndex;

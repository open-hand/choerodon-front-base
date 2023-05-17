import React from 'react';
import { StoreProvider } from './stores';
import Content from './Content';
import {
  TaskGroupManageIndexProps,
} from './interface';
import './index.less';

const TaskGroupManageIndex = (props: TaskGroupManageIndexProps) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
);

export default TaskGroupManageIndex;

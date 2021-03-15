import React from 'react';
import PermissionHOC from '@/src/app/iam/components/page-permission';
import { StoreProvider } from './stores';
import Content from './ApplicationTemplate';

export default PermissionHOC([])((props: any) => (
  <StoreProvider {...props}>
    <Content />
  </StoreProvider>
));

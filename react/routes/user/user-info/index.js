import React from 'react';
import { asyncRouter, C7NLocaleProvider } from '@choerodon/master';
import { StoreProvider } from './stores';

const UserInfo = asyncRouter(() => import('./UserInfo'));
const handleImport = (language) => import(`../../../locale/${language}`);

const Index = (props) => (
  <C7NLocaleProvider importer={handleImport}>
    <StoreProvider {...props}>
      <UserInfo />
    </StoreProvider>
  </C7NLocaleProvider>
);

export default Index;

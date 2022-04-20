/* eslint-disable */
import React from 'react';
import { SiderStoreProvider } from './stores';
import CreateSider from './CreateSider';
import UserRoleSider from './EditSider';
import ImportRoleSider from './ImportRoleSider';

export default (props) => (
  <SiderStoreProvider {...props}>
    {props.type === 'create' && <CreateSider />}
    {props.type === 'addRole' && <UserRoleSider />}
    {props.type === 'importRole' && <ImportRoleSider />}
  </SiderStoreProvider>
);

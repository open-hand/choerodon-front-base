import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import RoleAssignDataSet from './RoleAssignDataSet';
import addWayDataSet from './addWayDataSet';

import NormalFormDataSet from './normalFormDataSet';
import RoleChildrenDataSet from './roleChildrenDataSet';
import RoleFormDataSet from './roleFormDataSet';
import UserOptionDataSet from './UserOptionDataSet';

const Store = createContext();

export default Store;

export const SiderStoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const {
      AppState: { currentMenuType: { type, id }, getUserId: userId }, intl, children,
    } = props;
    const roleAssignDataSet = useMemo(() => new DataSet(RoleAssignDataSet({ id, intl })), [id]);

    const AddWayDataSet = useMemo(() => new DataSet(addWayDataSet()), []);
    const userOptionDataSet = useMemo(() => new DataSet(UserOptionDataSet({ id })), []);
    const normalFormDataSet = useMemo(() => new DataSet(NormalFormDataSet()), []);
    const roleChildrenDataSet = useMemo(() => new DataSet(RoleChildrenDataSet()), []);
    const roleFormDataSet = useMemo(() => new DataSet(RoleFormDataSet(roleChildrenDataSet)), []);

    const intlPrefix = 'c7ncd.org-user.sider';
    const dsStore = [];
    const value = {
      ...props,
      prefixCls: 'base-project-user-sider',
      intlPrefix,
      projectId: id,
      roleAssignDataSet,
      userId,
      dsStore,
      AddWayDataSet,
      userOptionDataSet,
      normalFormDataSet,
      roleFormDataSet,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import RoleAssignDataSet from './RoleAssignDataSet';
import addWayDataSet from './addWayDataSet';

const Store = createContext();

export default Store;

export const SiderStoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const {
      AppState: { currentMenuType: { type, id }, getUserId: userId }, intl, children,
    } = props;
    const roleAssignDataSet = useMemo(() => new DataSet(RoleAssignDataSet({ id, intl })), [id]);

    const AddWayDataSet = useMemo(() => new DataSet(addWayDataSet()), []);

    const intlPrefix = 'organization.user.sider';
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
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

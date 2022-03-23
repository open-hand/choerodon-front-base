import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import RoleAssignDataSet from './RoleAssignDataSet';
import addWayDataSet from './addWayDataSet';
import OutsourcingDataSet from './outsourcingDataSet';

const Store = createContext();

export default Store;

export const SiderStoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const {
      AppState: { currentMenuType: { type, id }, getUserId: userId }, intl, children,
    } = props;
    const roleAssignDataSet = useMemo(() => new DataSet(RoleAssignDataSet({ id, intl })), [id]);

    const AddWayDataSet = useMemo(() => new DataSet(addWayDataSet()), []);

    // 3gedouzaichushihuale
    const outsourcingDataSet = useMemo(() => new DataSet(OutsourcingDataSet()), []);

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
      outsourcingDataSet,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

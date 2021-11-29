import React, { createContext, useMemo, useContext } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import {
  useFormatCommon, useFormatMessage,
} from '@choerodon/master';
import PermissionInfoDataSet from './PermissionInfoDataSet';

const Store = createContext();
export function useStore() {
  return useContext(Store);
}
export default Store;

export const StoreProvider = injectIntl(inject('AppState', 'MenuStore')(
  (props) => {
    const intlPrefix = 'c7ncd.permission-info';
    const formatClient = useFormatMessage(intlPrefix);
    const formatCommon = useFormatCommon();
    const { AppState: { menuType: { orgId } }, children } = props;
    const permissionInfoDataSet = useMemo(() => new DataSet(PermissionInfoDataSet(
      formatClient, formatCommon, orgId,
    )), []);
    const value = {
      ...props,
      prefixCls: 'user-permissioninfo',
      intlPrefix,
      permissions: [
        'base-service.user.uploadPhoto',
      ],
      permissionInfoDataSet,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

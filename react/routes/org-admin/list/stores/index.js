import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import {
  useFormatCommon,
  useFormatMessage,
} from '@choerodon/master';
import OrgAdminListDataSet from './OrgAdminListDataSet';
import OrgAdminCreateDataSet from './OrgAdminCreateDataSet';

const Store = createContext();

export default Store;

export const StoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const { AppState: { currentMenuType: { type, id, organizationId } }, intl, children } = props;
    const intlPrefix = 'c7ncd.org-admin';
    const formatClient = useFormatMessage(intlPrefix);
    const formatCommon = useFormatCommon();

    const orgAdminListDataSet = useMemo(() => new DataSet(
      OrgAdminListDataSet({
        id, formatClient, formatCommon,
      }),
    ), [id]);
    const orgAdminCreateDataSet = useMemo(() => new DataSet(OrgAdminCreateDataSet({
      id, organizationId, formatCommon,
    })), [id]);
    const value = {
      ...props,
      orgAdminListDataSet,
      orgAdminCreateDataSet,
      prefixCls: 'base-org-admin-list',
      permissions: [
        'choerodon.code.organization.manager.organization-admin.ps.default',
      ],
      organizationId,
      formatClient,
      formatCommon,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

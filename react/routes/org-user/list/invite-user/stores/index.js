/* eslint-disable max-len */
import React, { createContext, useEffect, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import InviteUserDataSet from './InviteUserDataSet';
import OrgInfoDataSet from './OrgInfoDataSet';

const Store = createContext();

export default Store;

export const StoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const {
      AppState: { currentMenuType: { id, organizationId, projectId } },
      intl,
      children,
    } = props;
    const intlPrefix = 'organization.user.sider';
    const orgInfoDataSet = useMemo(() => new DataSet(OrgInfoDataSet({ id, organizationId })), [id]);
    const inviteUserDataSet = useMemo(() => new DataSet(InviteUserDataSet({ id, organizationId, orgInfoDataSet })), [id]);

    const value = {
      ...props,
      inviteUserDataSet,
      orgInfoDataSet,
      prefixCls: 'base-project-user-sider',
      intlPrefix,
      projectId: id,
      organizationId,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import OrgUserListDataSet from './OrgUserListDataSet';
import OrgRoleDataSet from './OrgRoleDataSet';
import OrgUserCreateDataSet from './OrgUserCreateDataSet';
import OrgUserRoleDataSet from './OrgUserRoleDataSet';
import AllRoleDataSet from './AllRoleDataSet';
import filterDataSet from './filterDataSet';

const Store = createContext();

export default Store;

export const StoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const { AppState: { currentMenuType: { id, organizationId } }, intl, children } = props;
    const intlPrefix = 'c7ncd.org-user';

    const formatCommon = useFormatCommon();
    const formatProjectUser = useFormatMessage(intlPrefix);

    const statusOptionData = [
      { text: formatCommon({ id: 'enable' }), value: 'true' },
      { text: formatCommon({ id: 'stop' }), value: 'false' },
    ];
    const statusOptionDs = useMemo(() => new DataSet({
      data: statusOptionData,
      selection: 'single',
    }));
    const safeOptionData = [
      { text: formatCommon({ id: 'normal' }), value: 'false' },
      { text: formatCommon({ id: 'locked' }), value: 'true' },
    ];
    const safeOptionDs = useMemo(() => new DataSet({
      data: safeOptionData,
      selection: 'single',
    }));
    const orgRoleDataSet = useMemo(() => new DataSet(OrgRoleDataSet({
      id,
    })), [id]);
    const orgUserListDataSet = useMemo(() => new DataSet(OrgUserListDataSet({
      id, formatProjectUser, formatCommon, statusOptionDs, safeOptionDs, orgRoleDataSet,
    })), [id]);
    const orgUserCreateDataSet = useMemo(() => new DataSet(OrgUserCreateDataSet({
      id, formatProjectUser, formatCommon, orgRoleDataSet,
    })), [id]);
    const orgUserRoleDataSet = useMemo(() => new DataSet(OrgUserRoleDataSet({
      id, formatProjectUser, formatCommon, orgRoleDataSet,
    })), [id]);
    const allRoleDataSet = useMemo(() => new DataSet(AllRoleDataSet({ id })), [id]);
    const FilterDataSet = useMemo(() => new DataSet(filterDataSet()), []);

    const value = {
      ...props,
      formatCommon,
      formatProjectUser,
      orgUserListDataSet,
      orgUserCreateDataSet,
      orgUserRoleDataSet,
      orgRoleDataSet,
      allRoleDataSet,
      prefixCls: 'base-project-user-list',
      intlPrefix,
      permissions: [
        'low-code-service.model-organization.pagedSearch',
      ],
      projectId: id,
      organizationId,
      FilterDataSet,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

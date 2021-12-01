import React, { createContext, useEffect, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import OrgUserListDataSet from './OrgUserListDataSet';
import OrgRoleDataSet from './OrgRoleDataSet';
import OrgUserCreateDataSet from './OrgUserCreateDataSet';
import OrgUserRoleDataSet from './OrgUserRoleDataSet';
import PasswordPolicyDataSet from '../../../safe/org-safe/store/PasswordPolicyDataSet';
import OrgAllRoleDataSet from './OrgAllRoleDataSet';
import useStore from './useStore';

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
    const userStore = useStore();

    const orgRoleDataSet = useMemo(() => new DataSet(
      OrgRoleDataSet({
        id,
        intl,
        intlPrefix,
      }),
    ), [id]);
    const orgUserListDataSet = useMemo(() => new DataSet(OrgUserListDataSet({
      id, formatCommon, formatProjectUser, statusOptionDs, safeOptionDs, orgRoleDataSet,
    })), [id]);
    const orgUserCreateDataSet = useMemo(() => new DataSet(OrgUserCreateDataSet({
      id, formatCommon, formatProjectUser, orgRoleDataSet, userStore,
    })), [id]);
    const orgUserRoleDataSet = useMemo(() => new DataSet(OrgUserRoleDataSet({
      id, formatCommon, formatProjectUser, orgRoleDataSet,
    })), [id]);
    const passwordPolicyDataSet = useMemo(() => new DataSet(
      PasswordPolicyDataSet(id, formatCommon, formatProjectUser),
    ), [id]);
    const orgAllRoleDataSet = useMemo(() => new DataSet(OrgAllRoleDataSet({ id })), [id]);

    useEffect(() => {
      userStore.checkCreate(organizationId);
    }, [organizationId]);

    const value = {
      ...props,
      formatProjectUser,
      formatCommon,
      orgUserListDataSet,
      orgUserCreateDataSet,
      orgUserRoleDataSet,
      orgRoleDataSet,
      orgAllRoleDataSet,
      prefixCls: 'base-org-user-list',
      intlPrefix,
      permissions: [
        'choerodon.code.organization.manager.user.ps.default',
      ],
      organizationId,
      passwordPolicyDataSet,
      userStore,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

import React, { createContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { DataSet } from 'choerodon-ui/pro';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import LdapDataSet from './LdapDataSet';
import LdapTestDataSet from './LdapTestDataSet';
import OrganizationDataSet from './OrganizationDataSet';

const Store = createContext();
export default Store;

export const StoreProvider = injectIntl(inject('AppState')((props) => {
  const intlPrefix = 'c7ncd.organization-setting';

  const formatCommon = useFormatCommon();
  const formatClient = useFormatMessage(intlPrefix);

  const { children, AppState: { currentMenuType: { id: orgId, name } } } = props;
  const ldapDataSet = useMemo(() => new DataSet(
    LdapDataSet({ orgId, name, formatClient }),
  ), [orgId]);
  const ldapTestDataSet = useMemo(() => new DataSet(LdapTestDataSet({ orgId })), [orgId]);
  const organizationDataSet = useMemo(() => new DataSet(
    OrganizationDataSet({ id: orgId, formatClient }),
  ), [orgId]);
  const value = {
    ...props,
    orgId,
    orgName: name,
    ldapDataSet,
    ldapTestDataSet,
    organizationDataSet,
    formatCommon,
    formatClient,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));

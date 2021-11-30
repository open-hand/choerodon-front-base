import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import {
  useFormatCommon,
  useFormatMessage,
} from '@choerodon/master';

const Store = createContext();

export function useOrgOverview() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { type, id, organizationId } }, intl,
  } = props;

  const intlPrefix = 'c7ncd.org-overview';
  const formatClient = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();

  const value = {
    ...props,
    permissions: [
      'devops-service.devops-organization.clusterOverview',
    ],
    formatClient,
    formatCommon,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

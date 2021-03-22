import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { useLocalStore } from 'mobx-react-lite';
import PasswordPolicyDataSet from './PasswordPolicyDataSet';

const Store = createContext();
export default Store;

export const StoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const { AppState: { currentMenuType: { id, type, organizationId } }, children, intl } = props;
    const intlPrefix = 'organization.pwdpolicy';
    const orgId = type === 'organization' ? id : organizationId;
    const passwordPolicyDataSet = useMemo(() => new DataSet(PasswordPolicyDataSet(orgId, id, intl, intlPrefix)), [orgId]);

    const remoteMobxStore = useLocalStore(() => ({
      disableAllBtn: false,
      get getDisableAllBtn() {
        return remoteMobxStore.disableAllBtn;
      },
      setDisable(status) {
        remoteMobxStore.disableAllBtn = status;
      },
    }));

    const value = {
      orgId,
      id,
      passwordPolicyDataSet,
      remoteMobxStore,
      intl,
      intlPrefix,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

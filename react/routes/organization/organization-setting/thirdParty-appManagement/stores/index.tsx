import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import FormDs from './formDataSet';

  interface ContextProps {
      intlPrefix: string,
      formDs: DataSet
      prefixCls: string
  }

  interface StoreProviderProps {
    children: React.ReactElement
  }

const Store = createContext({} as ContextProps);

export function useStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: StoreProviderProps) => {
  const {
    children,
  } = props;

  const formDs = useMemo(() => new DataSet(FormDs({ })), []);

  const value = {
    ...props,
    intlPrefix: 'c7ncd.organization-setting.thirdPartyAppManagement',
    prefixCls: 'c7ncd-organization-setting-thirdPartyAppManagement',
    formDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

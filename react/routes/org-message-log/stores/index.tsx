import React, {
  createContext, useContext, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import DingtalkMsgTable from './dingtalkTableDataset';

  interface ContextProps {
      intlPrefix: string,
      dingtalkMsgTableDs: DataSet
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

  const dingtalkMsgTableDs = useMemo(() => new DataSet(DingtalkMsgTable({ })), []);

  const value = {
    ...props,
    intlPrefix: '',
    prefixCls: 'c7ncd-org-message-log',
    dingtalkMsgTableDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

import React, { createContext, useMemo, useContext } from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import templateTableDataSet from './templateTableDataSet';

const Store = createContext();

export function useAppTemplateStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props) => {
  const {
    children,
  } = props;

  const TemplateTableDataSet = useMemo(() => new DataSet((templateTableDataSet())), []);

  const value = {
    ...props,
    TemplateTableDataSet,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

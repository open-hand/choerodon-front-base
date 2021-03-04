import React, { createContext, useMemo, useContext } from 'react';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import addTemplateDataSet
  from '@/src/app/iam/containers/application-template/components/addTemplate/stores/addTemplateDataSet';

const Store = createContext();

export function useAddTemplateStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props) => {
  const {
    children,
  } = props;

  const AddTemplateDataSet = useMemo(() => new DataSet(addTemplateDataSet()), []);

  const value = {
    ...props,
    AddTemplateDataSet,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

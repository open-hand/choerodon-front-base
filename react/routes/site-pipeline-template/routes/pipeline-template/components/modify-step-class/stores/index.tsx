/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { ModifyStepClassStoreContext, ProviderProps } from '../interface';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import modifyStepClassDataSet from './modifyStepClassDataSet';
import { DataSet } from 'choerodon-ui/pro';

const Store = createContext({} as ModifyStepClassStoreContext);

export function useModifyStepClassStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
    isEdit,
    record
  } = props;

  const prefixCls = 'c7ncd-modify-step-class' as const;
  const intlPrefix = 'c7ncd.modify.step.class' as const;

  const formatCommon = useFormatCommon();
  const formatModifyStepClass = useFormatMessage(intlPrefix);
  const modifyStepClassDs=useMemo(() => new DataSet(modifyStepClassDataSet({
    formatModifyStepClass, formatCommon,isEdit,record,
  })),[]);
  const mainStore = useStore();

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    formatModifyStepClass,
    formatCommon,
    modifyStepClassDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

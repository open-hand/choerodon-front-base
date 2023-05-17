/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { StepClassManageStoreContext, ProviderProps } from '../interface';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import stepClassManagementDataSet from './stepClassManageDataSet';
import { DataSet } from 'choerodon-ui/pro';

const Store = createContext({} as StepClassManageStoreContext);

export function useStepClassManageStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
  } = props;

  const prefixCls = 'c7ncd-step-class-manage' as const;
  const intlPrefix = 'c7ncd.step.class.manage' as const;

  const formatCommon = useFormatCommon();
  const formatStepClassManage = useFormatMessage(intlPrefix);
  const stepClassManagementDs=useMemo(() => new DataSet(stepClassManagementDataSet({
    formatStepClassManage, formatCommon,
  })),[]);
  const mainStore = useStore();

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    formatStepClassManage,
    formatCommon,
    stepClassManagementDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

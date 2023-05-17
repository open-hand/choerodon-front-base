/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { ModifyPipelineClassStoreContext, ProviderProps } from '../interface';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import modifyPipelineClassDataSet from './modifyPipelineClassDataSet';
import { DataSet } from 'choerodon-ui/pro';

const Store = createContext({} as ModifyPipelineClassStoreContext);

export function useModifyPipelineClassStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
  } = props;

  const prefixCls = 'c7ncd-modify-pipeline-class' as const;
  const intlPrefix = 'c7ncd.modify.pipeline.class' as const;

  const formatCommon = useFormatCommon();
  const formatModifyPipelineClass = useFormatMessage(intlPrefix);
  const modifyPipelineClassDs=useMemo(() => new DataSet(modifyPipelineClassDataSet({
    formatModifyPipelineClass, formatCommon
  })),[]);
  const mainStore = useStore();

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    formatModifyPipelineClass,
    formatCommon,
    modifyPipelineClassDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

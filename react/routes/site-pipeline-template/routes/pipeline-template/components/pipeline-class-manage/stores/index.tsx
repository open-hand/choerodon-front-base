/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { PipelineClassManageStoreContext, ProviderProps } from '../interface';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import pipelineClassManageDataSet from './pipelineClassManageDataSet';
import { DataSet } from 'choerodon-ui/pro';

const Store = createContext({} as PipelineClassManageStoreContext);

export function usePipelineClassManageStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
  } = props;

  const prefixCls = 'c7ncd-pipeline-class-manage' as const;
  const intlPrefix = 'c7ncd.pipeline.class.manage' as const;

  const formatCommon = useFormatCommon();
  const formatPipelineClassManage = useFormatMessage(intlPrefix);
  const pipelineClassManagementDs=useMemo(() => new DataSet(pipelineClassManageDataSet({
    formatPipelineClassManage, formatCommon,
  })),[]);
  const mainStore = useStore();

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    formatPipelineClassManage,
    formatCommon,
    pipelineClassManagementDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

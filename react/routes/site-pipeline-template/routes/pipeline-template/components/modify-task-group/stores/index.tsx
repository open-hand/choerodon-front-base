/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import { DataSet } from 'choerodon-ui/pro';
import useStore, { StoreProps } from './useStore';
import { ModifyTaskGroupStoreContext, ProviderProps } from '../interface';
import modifyTaskGroupDataSet from './modifyTaskGroupDataSet';

const Store = createContext({} as ModifyTaskGroupStoreContext);

export function useModifyTaskGroupStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
    isEdit,
  } = props;

  const prefixCls = 'c7ncd-modify-task-group' as const;
  const intlPrefix = 'c7ncd.modify.task.group' as const;

  const formatCommon = useFormatCommon();
  const formatModifyTaskGroup = useFormatMessage(intlPrefix);
  const modifyTaskGroupDs = useMemo(() => new DataSet(modifyTaskGroupDataSet({
    formatModifyTaskGroup, formatCommon,
  })), []);
  const mainStore = useStore();

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    formatModifyTaskGroup,
    formatCommon,
    modifyTaskGroupDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

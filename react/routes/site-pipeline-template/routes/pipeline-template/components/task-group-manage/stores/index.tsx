/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import useStore, { StoreProps } from './useStore';
import { TaskGroupManageStoreContext, ProviderProps } from '../interface';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import taskGroupManagementDataSet from './taskGroupManageDataSet';
import { DataSet } from 'choerodon-ui/pro';

const Store = createContext({} as TaskGroupManageStoreContext);

export function useTaskGroupManageStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
  } = props;

  const prefixCls = 'c7ncd-task-group-manage' as const;
  const intlPrefix = 'c7ncd.task.group.manage' as const;

  const formatCommon = useFormatCommon();
  const formatTaskGroupManage = useFormatMessage(intlPrefix);
  const taskGoupManagementDs=useMemo(() => new DataSet(taskGroupManagementDataSet({
    formatTaskGroupManage, formatCommon,
  })),[]);
  const mainStore = useStore();

  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    formatTaskGroupManage,
    formatCommon,
    taskGoupManagementDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

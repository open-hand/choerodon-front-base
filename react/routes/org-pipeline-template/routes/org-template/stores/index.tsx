import React, {
  createContext, useContext, useMemo,
} from 'react';
import { injectIntl } from 'react-intl';
import { useFormatMessage } from '@choerodon/master';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import PinelineTableDs from './pinelineTableDs';
import StepsTableDs from './stepsTableDs';
import TaskTableDs from './taskTableDs';

interface ContextProps {
    prefixCls: string,
    intlPrefix: string,
    pinelineTableDs: DataSet,
    stepsTableDs: DataSet,
    taskTableDs: DataSet,
    pinelineTempRefresh: any
    taskTempRefresh: any
    stepsTempRefresh: any
    formatClient: any
}

const Store = createContext({} as ContextProps);

export function useMainStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    AppState: { currentMenuType: { projectId } },
  } = props;

  const intlPrefix = 'c7ncd.org-pipeline-template';

  const formatClient = useFormatMessage(intlPrefix);

  const pinelineTableDs = useMemo(() => new DataSet(PinelineTableDs({ formatClient })), []);
  const stepsTableDs = useMemo(() => new DataSet(StepsTableDs({ formatClient })), []);
  const taskTableDs = useMemo(() => new DataSet(TaskTableDs({ formatClient })), []);

  const pinelineTempRefresh = () => { pinelineTableDs?.query(); };
  const stepsTempRefresh = () => { stepsTableDs?.query(); };
  const taskTempRefresh = () => { taskTableDs?.query(); };

  const value = {
    ...props,
    prefixCls: 'c7ncd-org-pipeline-template',
    intlPrefix,
    projectId,
    pinelineTableDs,
    stepsTableDs,
    taskTableDs,
    pinelineTempRefresh,
    stepsTempRefresh,
    taskTempRefresh,
    formatClient,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));

import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { useFormatMessage, useFormatCommon } from '@choerodon/master';
import useStore from './useStore';

import failedStatisticsTableDataSet from './failedStatisticsTableDataSet';

const Store = createContext();

export function useFailedStatisticsStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
  } = props;
  const intlPrefix = 'c7n.platform.thingPerform';
  const format = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();
  const FailedStatisticsTableDataSet = useMemo(() => new DataSet(
    failedStatisticsTableDataSet({ format, formatCommon }),
  ), []);
  const ThingPerformStore = useStore();

  const value = {
    ...props,
    FailedStatisticsTableDataSet,
    ThingPerformStore,
    format,
    formatCommon,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

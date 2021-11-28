import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { DataSet } from 'choerodon-ui/pro';
import { useFormatMessage, useFormatCommon } from '@choerodon/master';
import OnlineCurrentDataset from './OnlineCurrentDataset';
import SystemNoticeDataset from './SystemNoticeDataset';
import SystemOptsDataset from './SystemOptsDataset';
import useStore from './useStore';
import OnlineHourDataset from './OnlineHourDataset';
import ClusterDataSet from './ClusterDataSet';

const Store = createContext();

export function usePlatformOverviewStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
    AppState: { currentMenuType: { type, id, organizationId } }, intl,
  } = props;
  const intlPrefix = 'c7n.platform';
  const format = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();
  const platOverStores = useStore();
  const onlineNumDs = useMemo(() => new DataSet(OnlineCurrentDataset()), [id]); // 当前在线人数chart
  const onlineHourDs = useMemo(() => new DataSet(OnlineHourDataset()), [id]); // 当前每小时在线人数chart
  const noticeDs = useMemo(() => new DataSet(SystemNoticeDataset()), [id]); // 公告DS
  const optsDs = useMemo(() => new DataSet(SystemOptsDataset({ organizationId })), [id]); // 操作DS
  const clusterDs = useMemo(() => new DataSet(ClusterDataSet()), [id]);

  function renderMonth(month) {
    const dayMap = new Map([
      ['01', 'Jan'],
      ['02', 'Feb'],
      ['03', 'Mar'],
      ['04', 'Apr'],
      ['05', 'May'],
      ['06', 'Jun'],
      ['07', 'Jul'],
      ['08', 'Aug'],
      ['09', 'Sept'],
      ['10', 'Oct'],
      ['11', 'Nov'],
      ['12', 'Dec'],
    ]);
    return dayMap.get(month);
  }

  const value = {
    ...props,
    onlineNumDs,
    onlineHourDs,
    noticeDs,
    optsDs,
    platOverStores,
    clusterDs,
    renderMonth,
    intlPrefix,
    format,
    formatCommon,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

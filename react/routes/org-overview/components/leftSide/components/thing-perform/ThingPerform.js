import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ContainerBlock from '../../../ContainerBlock';
import Charts from './Charts';
import FailedStatistics from './FailedStatistics';
import { useFailedStatisticsStore } from './stores';
import { useOrgOverview } from '@/routes/org-overview/stores';

import './index.less';

const ThingPerform = observer(() => {
  const [chosenDays, setChosenDays] = useState(7);

  const {
    ThingPerformStore: { loading, ...ThingPerformStore },
    FailedStatisticsTableDataSet,
    AppState: {
      menuType: { orgId },
    },
  } = useFailedStatisticsStore();

  const {
    formatClient,
  } = useOrgOverview();

  const initData = (days) => {
    ThingPerformStore.initThingPerformChartData(orgId, days);
    FailedStatisticsTableDataSet.setQueryParameter('date', days);
    FailedStatisticsTableDataSet.query();
  };

  useEffect(() => {
    initData(chosenDays);
  }, []);

  const handleChangeDays = (days) => {
    setChosenDays(days);
    initData(days);
  };
  return (
    <div className="c7n-overview-thingPerform">
      <ContainerBlock
        width="100%"
        title={formatClient({ id: 'transactionExecution' })}
        hasDaysPicker
        handleChangeDays={handleChangeDays}
        loading={loading}
      >
        <Charts />
        <FailedStatistics />
      </ContainerBlock>
    </div>
  );
});

export default ThingPerform;

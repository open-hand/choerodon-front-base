import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ContainerBlock from '../../../org-overview/components/ContainerBlock';
import Charts from './Charts';
import FailedStatistics from './FailedStatistics';
import { useFailedStatisticsStore } from './stores';

import './index.less';

const ThingPerform = observer(() => {
  const [chosenDays, setChosenDays] = useState(7);

  const {
    ThingPerformStore: { loading, ...ThingPerformStore },
    FailedStatisticsTableDataSet,
    format,
    formatCommon,
  } = useFailedStatisticsStore();

  const initData = (days) => {
    ThingPerformStore.initThingPerformChartData(days);
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
        title={format({ id: 'situation' })}
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

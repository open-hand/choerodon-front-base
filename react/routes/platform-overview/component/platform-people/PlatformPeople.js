import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { useFormatMessage, useFormatCommon } from '@choerodon/master';
import ContainerBlock from '../../../org-overview/components/ContainerBlock';
import { usePlatformPeopleStore } from './stores';
import Chart from './Chart';

const PlatformPeople = observer(() => {
  const [chosenDay, setChosenDay] = useState(7);

  const {
    PlatformPeopleStore: { loading, ...PlatformPeopleStore },
    intlPrefix,
  } = usePlatformPeopleStore();
  const format = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();
  const initData = (day) => {
    const startTime = moment().subtract(day, 'days').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
    PlatformPeopleStore.initPlatformPeopleChartData(startTime, endTime);
  };

  useEffect(() => {
    initData(chosenDay);
  }, []);

  const handleChangeDays = (days) => {
    setChosenDay(days);
    initData(days);
  };

  return (
    <ContainerBlock
      width="58%"
      height="100%"
      title={format({ id: 'people' })}
      hasDaysPicker
      handleChangeDays={handleChangeDays}
      loading={loading}
    >
      <Chart />
    </ContainerBlock>
  );
});

export default PlatformPeople;

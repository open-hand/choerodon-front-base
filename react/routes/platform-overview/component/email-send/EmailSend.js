import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { useFormatMessage } from '@choerodon/master';
import ContainerBlock from '../../../org-overview/components/ContainerBlock';
import { useEmailSendStore } from './stores';
import Chart from './Chart';

const EmailSend = observer(() => {
  const [chosenDays, setChosenDays] = useState(7);
  const {
    EmailSendStore,
    EmailSendStore: { loading },
    intlPrefix,
  } = useEmailSendStore();
  const format = useFormatMessage(intlPrefix);
  const initData = (days) => {
    const startTime = moment().subtract(days, 'days').format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
    EmailSendStore.initEmailSendByDate(startTime, endTime);
  };

  useEffect(() => {
    initData(chosenDays);
  }, []);

  const handleChangeDays = (days) => {
    setChosenDays(days);
    initData(days);
  };

  return (
    <ContainerBlock
      width="100%"
      height="400px"
      title={format({ id: 'situation' })}
      hasDaysPicker
      handleChangeDays={handleChangeDays}
      loading={loading}
    >
      <Chart />
    </ContainerBlock>
  );
});

export default EmailSend;

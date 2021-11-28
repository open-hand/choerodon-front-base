import React, { useState } from 'react';
import './DaysPicker.less';
import { useFormatMessage } from '@choerodon/master';

// 很多地方用到这个dayspicker  useOrgOverview不能用 不然其它地方报错
const DaysPicker = (props) => {
  const {
    handleChangeDays,
  } = props;
  const [day, setDay] = useState(7);

  const formatClient = useFormatMessage('c7ncd.org-overview');

  const clickDay = (i) => {
    setDay(i);
    if (handleChangeDays) {
      handleChangeDays(i);
    }
  };
  const intlPrefix = 'c7n.datePiker';
  const format = useFormatMessage(intlPrefix);
  const getContent = () => [7, 15, 30].map((i, iIndex) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        role="none"
        className={day === i ? 'c7n-overview-dayspicker-days c7n-overview-dayspicker-days-picked' : 'c7n-overview-dayspicker-days'}
        onClick={() => clickDay(i)}
      >
        <span>{formatClient({ id: 'lastdays' }, { name: i })}</span>
      </div>
      {iIndex !== 2 ? (<span className="c7n-overview-dayspicker-splitSpan" />) : ''}
    </div>
  ));

  return (
    <div className="c7n-overview-dayspicker">
      {getContent()}
    </div>
  );
};

export default DaysPicker;

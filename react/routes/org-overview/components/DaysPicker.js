import React, { useState } from 'react';
import { useOrgOverview } from '@/routes/org-overview/stores';
import './DaysPicker.less';

const DaysPicker = (props) => {
  const {
    handleChangeDays,
  } = props;
  const [day, setDay] = useState(7);

  const {
    formatClient,
  } = useOrgOverview();

  const clickDay = (i) => {
    setDay(i);
    if (handleChangeDays) {
      handleChangeDays(i);
    }
  };

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

/* eslint-disable react/no-danger */
import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, Tooltip } from 'choerodon-ui';
import './index.less';
import { usePlatformOverviewStore } from '../../stores';
import TimeItem from './TimeItem';

const TimeLine = observer(() => {
  const {
    noticeDs,
    platOverStores,
    renderMonth,
    format,
    formatCommon,
  } = usePlatformOverviewStore();

  const scorllRef = useRef();

  const [isMore, setLoadMoreBtn] = useState(false);

  const record = noticeDs.current && noticeDs.toData();

  // 加载记录
  async function loadData(page = 1) {
    const res = await noticeDs.query(page);
    const records = platOverStores.getOldNoticeRecord;
    if (res && !res.failed) {
      if (!res.isFirstPage) {
        noticeDs.unshift(...records);
      }
      platOverStores.setOldNoticeRecord(noticeDs.records);
      const lastRecord = noticeDs.records[noticeDs.records.length - 1];
      const getDom = document.querySelector(`#notice-${renderId(lastRecord.get('id'))}`);
      if (getDom && !res.isFirstPage) {
        const parent = scorllRef.current;
        parent.scrollTo({
          behavior: 'smooth',
          top: parent.scrollHeight,
        });
      }
      setLoadMoreBtn(res.hasNextPage);
      return res;
    }
    return false;
  }

  // 更多公告
  const loadMoreNoticeRecord = () => {
    loadData(noticeDs.currentPage + 1);
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderDateLine = (date) => {
    const dateArr = date && date.split('-');
    const month = renderMonth(dateArr[1]);
    return (
      <Tooltip title={date}>
        <div className="c7ncd-notice-timeLine-date">
          <span>{dateArr[2].split(' ')[0]}</span>
          <span>{month}</span>
        </div>
      </Tooltip>
    );
  };

  const renderId = (id) => {
    const type = typeof id;
    if (type === 'string') {
      return id.slice(3, 6);
    } if (type === 'number') {
      return String(id).slice(3, 6);
    }
    return id;
  };

  function renderData() {
    return record ? (
      <ul>
        {
          record.map((item) => {
            const {
              id,
            } = item;
            return (
              <TimeItem
                {...item}
                key={id}
                renderId={renderId}
                renderDateLine={renderDateLine}
              />
            );
          })
        }
      </ul>
    ) : null;
  }

  return (
    <div className="c7ncd-notice-timeLine">
      {record && record.length > 0 ? (
        <div className="c7ncd-notice-timeLine-body" ref={scorllRef}>
          {renderData()}
        </div>
      ) : <span className="c7ncd-notice-timeLine-empty">{format({ id: 'noMoreRecods' })}</span>}
      {isMore && <Button disabled={noticeDs.status === 'loading'} loading={noticeDs.status === 'loading'} type="primary" onClick={loadMoreNoticeRecord}>{formatCommon({ id: 'loadMore' })}</Button>}
    </div>
  );
});

export default TimeLine;

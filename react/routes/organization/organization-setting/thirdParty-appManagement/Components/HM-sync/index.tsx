import React, { useState, useEffect } from 'react';
import { Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import './index.less';
import moment from 'moment';
import { organizationsApi } from '@choerodon/master';

export interface Props {
  prefixCls: string
  recordData: Record
}

let timer :any;

const Index: React.FC<Props> = (props) => {
  // @ts-ignore
  const { modal, prefixCls, recordData } = props;

  const [syncing, setSyncing] = useState(false);
  const [syncInfo, setSyncInfo] = useState({
    updateUserCount: 0,
    newUserCount: 0,
    errorUserCount: 0,
    syncEndTime: 0,
    syncBeginTime: 0,
  });

  async function getLatestHistory() {
    const res = await organizationsApi.thirdPartyAppLatestHistory(recordData.get('id'));
    if (res.data === '') {
      return;
    }
    setSyncInfo(res);
  }

  useEffect(() => {
    getLatestHistory();
    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleOk = async () => {
    if (!syncing) {
      clearInterval(timer);
      setSyncing(true);
      modal.update({
        title: '正在同步用户中…',
        okText: '返回',
      });
      organizationsApi.thirdPartyAppHMSync({
        app_type: recordData.get('type'),
      });
      timer = setInterval(() => {
        setSyncing(false);
        getLatestHistory();
        modal.update({
          title: '手动同步用户',
          okText: '手动同步',
        });
      }, 10000);
      return false;
    }
    return true;
  };

  function handleLoadTime() {
    if (!syncInfo.syncEndTime) {
      return '-';
    }
    const startTime = syncInfo.syncBeginTime;
    const endTime = syncInfo.syncEndTime;

    if (startTime === endTime) {
      return '1秒';
    }

    const releaseDate = moment(endTime);
    const currentDate = moment(startTime);

    const diff = releaseDate.diff(currentDate);
    const diffDuration = moment.duration(diff);

    const diffYears = diffDuration.years();
    const diffMonths = diffDuration.months();
    const diffDays = diffDuration.days();
    const diffHours = diffDuration.hours();
    const diffMinutes = diffDuration.minutes();
    const diffSeconds = diffDuration.seconds();

    return `${diffYears ? `${diffYears}年` : ''}${diffMonths ? `${diffMonths}月` : ''}${diffDays ? `${diffDays}日` : ''}${diffHours ? `${diffHours}小时` : ''}${diffMinutes ? `${diffMinutes}分钟` : ''}${diffSeconds ? `${diffSeconds}秒` : ''}`;
  }

  modal.handleOk(handleOk);

  return (
    <div>
      {
        !syncing && (
          <div>
            <p className={`${prefixCls}-HM-p1`}>
              上次同步完成时间
              {' '}
              {syncInfo.syncEndTime === 0 ? '-' : syncInfo.syncEndTime}
              {' '}
              （耗时
              {handleLoadTime()}
              ），
            </p>
            <p className={`${prefixCls}-HM-p2`}>
              共同步
              &nbsp;
              <span className={`${prefixCls}-HM-success-num`}>{syncInfo.updateUserCount + syncInfo.newUserCount + syncInfo.errorUserCount}</span>
              &nbsp;
              个用户成功,
              &nbsp;
              <span className={`${prefixCls}-HM-failed-num`}>{syncInfo.errorUserCount}</span>
              &nbsp;
              个用户失败
            </p>
          </div>
        )
      }

      {
        syncing && (
          <div>
            <div className={`${prefixCls}-HM-syncing-div1`}><Spin size={'large' as any} /></div>
            <div className={`${prefixCls}-HM-syncing-div2`}>本次导入耗时较长，您可返回进行其他操作</div>
          </div>
        )
      }
    </div>
  );
};

export default observer(Index);

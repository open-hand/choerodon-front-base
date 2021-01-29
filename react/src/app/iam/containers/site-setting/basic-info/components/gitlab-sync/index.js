import React, { useEffect, useState } from 'react';
import { message } from 'choerodon-ui';
import LoadingProgress from '@choerodon/testmanager-pro/lib/components/progress-loading';
import { axios } from '@choerodon/boot';
import { getDuration } from '../../../../../utils';

import './index.less';

const map = {
  manual: '手动',
  auto: '自动',
};

export default ({ modal }) => {
  const [data, setData] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [percent, setPercent] = useState(null);

  useEffect(() => {
    axios.get('/devops/v1/users/sync_records').then((res) => {
      setData(res);
    });
  }, []);

  const handleSubmit = () => {
    let polling;
    setIsSyncing(true);
    axios.post('/devops/v1/users/trigger_syncing').then(() => {
      polling = setInterval(() => {
        axios.get('/devops/v1/users/sync_records').then((res) => {
          setPercent(parseInt((res.current / res.total) * 100, 10));
          console.log(parseInt((res.current / res.total) * 100, 10));
          if (res.status === 'finished') {
            clearInterval(polling);
            setIsSyncing(false);
            setPercent(0);
            message.success('同步成功');
            setData(res);
          }
        });
      }, 1000);
    });
    return false;
  };

  modal.handleOk(handleSubmit);

  return (
    <div className="c7ncd-gitlab-sync">
      <p className="c7ncd-gitlab-sync-title">
        GitLab用户同步记录
      </p>
      <div className="c7ncd-gitlab-sync-line">
        <p className="c7ncd-gitlab-sync-line-key">
          上次同步类型
        </p>
        <p className="c7ncd-gitlab-sync-line-value">
          {data?.type ? map[data?.type] : '无'}
        </p>
      </div>
      <div className="c7ncd-gitlab-sync-line">
        <p className="c7ncd-gitlab-sync-line-key">
          上次同步完成时间
        </p>
        <p className="c7ncd-gitlab-sync-line-value">
          {data?.endTime ? `${data.endTime}(耗时${(data.startTime && data.endTime) ? getDuration(data.startTime, data.endTime) : '1秒'})` : '无'}
        </p>
      </div>
      <p className="c7ncd-gitlab-sync-text">
        共成功同步
        <span className="c7ncd-gitlab-sync-text-success">
          {data?.successCount || '0'}
        </span>
        个用户至GitLab,
        <span className="c7ncd-gitlab-sync-text-error">
          {data?.failCount || '0'}
        </span>
        个用户同步失败
      </p>
      {
        data.errorUserResultUrl && (
          <a role="none" onClick={() => window.open(data.errorUserResultUrl)}>点击下载失败详情</a>
        )
      }
      <div className="c7ncd-gitlab-sync-divided" />
      {
        isSyncing && (
          <LoadingProgress
            style={{
              marginTop: 38,
            }}
            percent={percent}
            customTipText={(
              <div>
                <p className="c7ncd-gitlab-sync-loading-p1">正在同步平台用户至GitLab</p>
                <p className="c7ncd-gitlab-sync-loading-p2">此次导入可能消耗较长时间，您可先返回执行其他操作。</p>
              </div>
            )}
          />
        )
      }
    </div>
  );
};

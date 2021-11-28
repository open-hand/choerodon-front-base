import React, { useEffect } from 'react';
import './index.less';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { C7NFormat } from '@choerodon/master';
import { usePlatformOverviewStore } from '../../stores';

const clusterType = [
  {
    code: 'connectedClusters',
    text: <C7NFormat
      intlPrefix="c7n.platform"
      id="connectedClusters"
    />,
  },
  {
    code: 'unconnectedCluster',
    text: <C7NFormat
      intlPrefix="c7n.platform"
      id="unconnectedCluster"
    />,
  },
];

export default observer(() => {
  const {
    clusterDs,
  } = usePlatformOverviewStore();

  const record = clusterDs.current;

  useEffect(() => {

  }, []);

  const renderContent = () => (
    clusterType.map((item) => (
      <div className="c7n-platform-clusterOverview-right-content" key={item.code}>
        <span>{item.text}</span>
        <span>{record ? record.get(item.code) : '-'}</span>
      </div>
    ))
  );

  return (
    <div className="c7n-platform-clusterOverview">
      <div className="c7n-platform-clusterOverview-left">
        <Icon type="cluster" />
      </div>
      <div className="c7n-platform-clusterOverview-right">
        {renderContent()}
      </div>
    </div>
  );
});

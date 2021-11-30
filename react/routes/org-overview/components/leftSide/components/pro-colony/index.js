import React from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import ContainerBlock from '../../../ContainerBlock';
import { useOrgOverviewLeftSide } from '../../stores';
import './index.less';
import { useOrgOverview } from '@/routes/org-overview/stores';

const ProColony = observer(() => {
  const {
    clusterDs,
    projectDs,
  } = useOrgOverviewLeftSide();

  const {
    formatClient,
  } = useOrgOverview();

  const ClusterType = [
    {
      text: formatClient({ id: 'runningCluster' }),
      code: 'connectedClusters',
    },
    {
      text: formatClient({ id: 'disconnectedCluster' }),
      code: 'unconnectedCluster',
    },
  ];

  const ProjectType = [
    {
      text: formatClient({ id: 'enableProject' }),
      code: 'enableSum',
    },
    {
      text: formatClient({ id: 'stopProject' }),
      code: 'stopSum',
    },
  ];

  const clusterRecord = clusterDs.current;
  const projectRecord = projectDs.current;

  const renderClusterDetail = () => (
    ClusterType.map((item) => (
      <div className="c7n-overview-content-number_group-item">
        <span>{clusterRecord ? clusterRecord.get(item.code) : '-'}</span>
        <span>{item.text}</span>
      </div>
    ))
  );

  const renderProjectDetail = () => (
    ProjectType.map((item) => (
      <div className="c7n-overview-content-number_group-item">
        <span>{projectRecord ? projectRecord.get(item.code) : '-'}</span>
        <span>{item.text}</span>
      </div>
    ))
  );

  return (
    <div className="c7n-overview-procolony">
      <ContainerBlock width="49%" height={140}>
        <div className="c7n-overview-content">
          <Icon type="project_group" />
          <div className="c7n-overview-number_group">
            {renderProjectDetail()}
          </div>
        </div>
      </ContainerBlock>
      <ContainerBlock width="47.5%" height={140}>
        <div className="c7n-overview-content">
          <Icon type="cluster" />
          <div className="c7n-overview-number_group">
            {renderClusterDetail()}
          </div>
        </div>
      </ContainerBlock>
    </div>
  );
});

export default ProColony;

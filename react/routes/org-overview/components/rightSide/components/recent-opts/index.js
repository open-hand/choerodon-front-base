import React from 'react';
import { observer } from 'mobx-react-lite';
import ContainerBlock from '../../../ContainerBlock';
import TimeLine from '../time-line';
import './index.less';
import { useOrgOverview } from '@/routes/org-overview/stores';

const RecentOpts = observer(() => {
  const {
    formatClient,
  } = useOrgOverview();
  return (
    <div className="c7n-overview-recentOpts">
      <ContainerBlock width="100%">
        <span className="c7n-overview-recentOpts-header">{formatClient({ id: 'OrgOperationRecords' })}</span>
        <TimeLine />
      </ContainerBlock>
    </div>
  );
});

export default RecentOpts;

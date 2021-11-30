import React from 'react';
import { observer } from 'mobx-react-lite';
import ContainerBlock from '../../../ContainerBlock';
import './index.less';
import { useOrgOverview } from '@/routes/org-overview/stores';

import PieChart from './PieChart';

const AppOverview = observer(() => {
  const {
    formatClient,
  } = useOrgOverview();

  return (
    <div className="c7n-overview-appOverview">
      <ContainerBlock width="100%">
        <div className="c7n-overview-appOverview-header">
          <span>{formatClient({ id: 'appOverview' })}</span>
          <span>{formatClient({ id: 'unitNum' })}</span>
        </div>
        <PieChart />
      </ContainerBlock>
    </div>
  );
});

export default AppOverview;

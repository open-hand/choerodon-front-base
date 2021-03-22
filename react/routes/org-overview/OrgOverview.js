import React from 'react';
import { observer } from 'mobx-react-lite';
import { Breadcrumb, Page, Content } from '@choerodon/boot';
import LeftSide from './components/leftSide';
import RightSide from './components/rightSide';

import './OrgOverview.less';

const OrgOverview = observer(() => (
  <Page className="c7n-org-overview" service={['choerodon.code.organization.manager.overview.ps.default']}>
    <Breadcrumb />
    <Content className="c7n-org-overview-content" style={{ paddingTop: 0 }}>
      <LeftSide />
      <RightSide />
    </Content>
  </Page>
));

export default OrgOverview;

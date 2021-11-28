import React from 'react';
import { observer } from 'mobx-react-lite';
import { Breadcrumb, Page, Content } from '@choerodon/boot';

import ContainerBlock from '../org-overview/components/ContainerBlock';
import PlatformPeople from './component/platform-people';
import ThingPerform from './component/thing-perform';
import EmailSend from './component/email-send';
import TimeLine from './component/time-line';
import LineChart from './component/onLine-chart';
import OptsLine from './component/opts-line';
import ClusterOverview from './component/cluster-overview';
import { usePlatformOverviewStore } from './stores';

import './PlatformOverview.less';

const PlatformOverview = observer(() => {
  const { format } = usePlatformOverviewStore();

  return (
    <Page
      className="c7n-platform-overview"
      service={['choerodon.code.site.manager.platform-overview.ps.default']}
    >
      <Breadcrumb />
      <Content style={{ paddingTop: 0 }}>
        <div className="c7n-platform-overview-firstline">
          <div className="c7n-platform-overview-firstline-left">
            <ContainerBlock height="108px" width="100%" style={{ marginBottom: '20px' }}>
              <ClusterOverview />
            </ContainerBlock>
            <LineChart />
          </div>
          <PlatformPeople />
        </div>
        <div className="c7n-platform-overview-content">
          <div className="c7n-platform-overview-content-left">
            <EmailSend />
            <ThingPerform />
          </div>
          <div className="c7n-platform-overview-content-right">
            <ContainerBlock
              width="100%"
              title={format({ id: 'systemAnnouncement' })}
            >
              <TimeLine />
            </ContainerBlock>
            <ContainerBlock
              style={{
                marginTop: 20,
              }}
              width="100%"
              title={format({ id: 'operationRecords' })}
            >
              <OptsLine />
            </ContainerBlock>
          </div>
        </div>
      </Content>
    </Page>
  );
});

export default PlatformOverview;

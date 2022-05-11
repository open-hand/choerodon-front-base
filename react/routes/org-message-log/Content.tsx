import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  useFormatCommon, useFormatMessage, Content, Page, Breadcrumb,
} from '@choerodon/master';
import { Tabs } from 'choerodon-ui/pro';
import { useStore } from './stores/index';
import DingtalkMsgTable from './Components/dingtalkMsgTable';
import './index.less';

export interface Props {

}

const { TabPane } = Tabs;

const PageContent: React.FC<Props> = (props) => {
  const {
    intlPrefix, prefixCls,
  } = useStore();
  const formatCommon = useFormatCommon();
  const formatMessage = useFormatMessage(intlPrefix);

  const [activeKey, setActiveKey] = useState('dingtalkmsg');

  const panes = useMemo(() => [
    {
      key: 'dingtalkmsg',
      tab: '钉钉日志',
      child: <DingtalkMsgTable />,
      headerBtns: [
        // {
        //   name: formatClient({ id: 'pipeline.create' }),
        //   icon: 'playlist_add',
        //   handler: () => { pipelineTempCreate('default') },
        // },
        // {
        //   icon: 'refresh',
        //   handler: pinelineTempRefresh,
        // },
      ],
    },
  ], []);

  return (
    <Page>
      <Breadcrumb />
      <Content className={`${prefixCls}-page-content`}>
        {/* onChange={tabsChange} */}
        <Tabs activeKey={activeKey}>
          {panes.map((item: any) => (
            <TabPane key={item.key} tab={item.tab}>
              {item.child}
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Page>
  );
};

export default (observer(PageContent));

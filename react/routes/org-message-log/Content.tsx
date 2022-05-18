import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  useFormatCommon, useFormatMessage, Content, Page, Breadcrumb, HeaderButtons, Header,
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
    intlPrefix, prefixCls, dingtalkMsgTableDs,
  } = useStore();
  const formatCommon = useFormatCommon();
  const formatMessage = useFormatMessage(intlPrefix);

  const [activeKey, setActiveKey] = useState('dingtalkmsg');

  const dingtalkmsgRefresh = () => {
    dingtalkMsgTableDs.query();
  };

  function getActiveKeyIndex(key: string) {
    let activeIndex;
    panes.forEach((item, index) => {
      if (item.key === key) {
        activeIndex = index;
      }
    });
    return activeIndex;
  }

  const panes = useMemo(() => [
    {
      key: 'dingtalkmsg',
      tab: '钉钉日志',
      child: <DingtalkMsgTable />,
      headerBtns: [
        {
          icon: 'refresh',
          handler: dingtalkmsgRefresh,
        },
      ],
    },
  ], []);

  // @ts-ignore
  // eslint-disable-next-line max-len
  const headerBtns = useMemo(() => () => panes[getActiveKeyIndex(activeKey)].headerBtns, [activeKey]);

  return (
    <Page>
      <Header>
        <HeaderButtons items={headerBtns()} />
      </Header>
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

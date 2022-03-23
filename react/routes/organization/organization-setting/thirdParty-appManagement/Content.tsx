import React, { } from 'react';
import { observer } from 'mobx-react-lite';
import {
  useFormatCommon, useFormatMessage,
} from '@choerodon/master';
import { NewTips } from '@choerodon/components';
import { Form, Output, Modal } from 'choerodon-ui/pro';
import {
  Content,
  Header,
  Breadcrumb,
  TabPage,
  HeaderButtons,
  CONSTANTS,
} from '@choerodon/boot';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import EditInfo from './Components/edit-info';
import SyncSet from './Components/sync-set';
import HMSync from './Components/HM-sync';

import { useStore } from './stores/index';

const {
  MODAL_WIDTH: {
    MIN, MIDDLE,
  },
} = CONSTANTS;

export interface Props extends RouteComponentProps {

}

const PageContent: React.FC<Props> = (props) => {
  const { history, location: { search }, location } = props;
  const {
    intlPrefix, prefixCls, formDs,
  } = useStore();
  const match = useRouteMatch();

  const formatCommon = useFormatCommon();
  const formatMessage = useFormatMessage(intlPrefix);

  const renderApplyPermission = () => <span>如何申请权限</span>;

  const handleEditClick = () => {
    Modal.open({
      title: '修改设置',
      drawer: true,
      children: <EditInfo recordData={formDs?.current?.toData()[0]} />,
      style: { width: MIN },
      okText: '保存',
    });
  };

  const handleDisableClick = () => {
    Modal.open({
      title: '停用钉钉用户同步',
      children: (<div>确定要停用钉钉用户同步吗？停用后，之前所同步的用户将无法登录平台，且无法使用测试连接和同步用户功能。</div>),
      style: { width: 600 },
      onOk: async () => {
        console.log(999);
        return false;
      },
    });
  };

  const handleSyncSetClick = () => {
    Modal.open({
      title: '同步设置',
      children: <SyncSet />,
      drawer: true,
      style: { width: MIN },
      okText: '保存',
    });
  };

  const handleHMSyncClick = () => {
    Modal.open({
      title: '手动同步用户',
      children: <HMSync />,
      drawer: true,
      style: { width: MIN },
      okText: '手动同步',
    });
  };

  const handleSyncRecordClick = () => {
    history.push({
      pathname: `${match.url}/sync-record`,
      search: `${search}&appType=dingding'`,
    });
  };

  return (
    <TabPage
      className={prefixCls}
      service={['choerodon.code.organization.setting.general-setting.ps.info']}
    >
      <Header>
        <HeaderButtons
          items={[
            {
              name: '修改',
              icon: 'sync_alt',
              permissions: [
              ],
              handler: handleEditClick,
            },
            {
              name: '停用',
              icon: 'sync_alt',
              permissions: [
              ],
              handler: handleDisableClick,
            },
            {
              name: '同步设置',
              icon: 'sync_alt',
              permissions: [
              ],
              handler: handleSyncSetClick,
            },
            {
              name: '手动同步',
              icon: 'sync_alt',
              permissions: [
              ],
              handler: handleHMSyncClick,
            },
            {
              name: '同步记录',
              icon: 'edit-o',
              permissions: [
              ],
              handler: handleSyncRecordClick,
            },
          ]}
        />
      </Header>

      <Breadcrumb />

      <Content>
        <Form
          dataSet={formDs}
          labelLayout={'horizontal' as any}
          labelAlign={'left' as any}
        >
          <Output
            label={(
              <span className={`${prefixCls}-form-title`}>
                基本信息
              </span>
            )}
          />
          <Output name="a" />
          <Output name="b" />
          <Output label="申请权限" renderer={renderApplyPermission} />
          <Output
            label={(
              <span className={`${prefixCls}-form-title`}>
                用户信息
              </span>
            )}
          />
          <Output name="c" />
          <Output
            label={(
              <span>
                邮箱
                <NewTips helpText="邮箱属于猪齿鱼系统必填项，请确保钉钉有邮箱，否则将同步失效。" />
              </span>
            )}
            name="d"
          />
          <Output name="e" />
          <Output name="f" />
        </Form>
      </Content>
    </TabPage>
  );
};

export default withRouter(observer(PageContent));

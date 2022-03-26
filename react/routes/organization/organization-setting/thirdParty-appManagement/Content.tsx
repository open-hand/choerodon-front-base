import React, { } from 'react';
import { observer } from 'mobx-react-lite';
import {
  useFormatCommon, useFormatMessage, organizationsApi,
} from '@choerodon/master';
import { NewTips, StatusTag } from '@choerodon/components';
import {
  Form, Output, Modal, message, Tooltip,
} from 'choerodon-ui/pro';
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  Content,
  Header,
  Breadcrumb,
  TabPage,
  CONSTANTS,
  Action,
} from '@choerodon/boot';

import dingtalkDisable from './imgs/dingtalk-disable.svg';
import dingtalkActive from './imgs/dingtalk-active.svg';
import dingtalklogoActive from './imgs/dingtalklogo-active.svg';
import dingtalklogoDisable from './imgs/dingtalklogo-disable.svg';
import EditInfo from './Components/edit-info';
import SyncSet from './Components/sync-set';
import HMSync from './Components/HM-sync';
import DingTalkSyncRecord from './Components/sync-record/ding-talk';
import { useStore } from './stores/index';

const {
  MODAL_WIDTH: {
    MIN, MAX,
  },
} = CONSTANTS;

const imgMap = new Map([
  ['bgding_talkactive', dingtalkActive],
  ['bgding_talkdisable', dingtalkDisable],
  ['logoding_talkactive', dingtalklogoActive],
  ['logoding_talkdisable', dingtalklogoDisable],
]);

export interface Props {

}

const PageContent: React.FC<Props> = (props) => {
  const {
    intlPrefix, prefixCls, formDs,
  } = useStore();

  const formatCommon = useFormatCommon();
  const formatMessage = useFormatMessage(intlPrefix);

  const renderApplyPermission = () => <span role="none" onClick={jump} style={{ cursor: 'pointer', color: '#415BC9' }}>如何申请权限</span>;

  const jump = () => {
    window.open('https://choerodon.com.cn/#/knowledge/share/3f54b341ad7818fb');
  };

  const refresh = () => {
    formDs.query();
  };

  const handleEditClick = (record: Record) => {
    Modal.open({
      title: '修改设置',
      drawer: true,
      children: <EditInfo recordData={record} prefixCls={prefixCls} refresh={refresh} />,
      style: { width: MIN },
      okText: '保存',
    });
  };

  const handleDisableClick = (record: Record) => {
    Modal.open({
      title: '停用钉钉用户同步',
      children: (<div>确定要停用钉钉用户同步吗？停用后，之前所同步的用户将无法登录平台，且无法使用测试连接和同步用户功能。</div>),
      style: { width: 600 },
      onOk: async () => {
        try {
          await organizationsApi.thirdPartyAppDisable({
            open_app_id: record.get('id'),
          });
          message.success('停用应用成功');
          refresh();
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    });
  };

  const handleEnableClick = async (record: Record) => {
    try {
      await organizationsApi.thirdPartyAppEnable({
        open_app_id: record.get('id'),
      });
      message.success('启用应用成功');
      refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSyncSetClick = (record: Record) => {
    Modal.open({
      title: '同步设置',
      children: <SyncSet recordData={record} refresh={refresh} />,
      drawer: true,
      style: { width: MIN },
      okText: '保存',
    });
  };

  const handleHMSyncClick = (record: Record) => {
    Modal.open({
      title: '手动同步用户',
      children: <HMSync prefixCls={prefixCls} recordData={record} />,
      style: { width: 600 },
      okText: '手动同步',
    });
  };

  const handleSyncRecordClick = (record: Record) => {
    Modal.open({
      title: '同步记录',
      drawer: true,
      children: <DingTalkSyncRecord recordData={record} />,
      style: { width: MAX },
      okCancel: false,
      okText: '关闭',
    });
  };

  const getActionData = (record: Record) => {
    const actionDatas = [];

    if (!record.get('id')) {
      actionDatas.push({
        service: [],
        text: '修改',
        action: () => handleEditClick(record),
      });
    } else {
      actionDatas.push(
        {
          service: [],
          text: '修改',
          action: () => handleEditClick(record),
        },
        {
          service: [],
          text: '同步设置',
          action: () => handleSyncSetClick(record),
        },
        {
          service: [],
          text: '手动同步',
          action: () => handleHMSyncClick(record),
        },
        {
          service: [],
          text: '同步记录',
          action: () => handleSyncRecordClick(record),
        },
      );
      record.get('enabledFlag') ? actionDatas.splice(1, 0,
        {
          service: [],
          text: '停用',
          action: () => { handleDisableClick(record); },
        }) : actionDatas.splice(1, 0,
        {
          service: [],
          text: '启用',
          action: () => handleEnableClick(record),
        });
    }

    return actionDatas;
  };

  const getName = (record: Record) => {
    const appNameObj = {
      ding_talk: '钉钉',
    };
    // @ts-ignore
    return appNameObj[record.get('type')];
  };

  const getImg = (record:Record, imgType: 'bg' | 'logo') => {
    const active = record.get('enabledFlag') ? 'active' : 'disable';
    const appType = record.get('type');
    return imgMap.get(imgType + appType + active);
  };

  const handleMouseEnter = (e:any, text:string) => {
    const { currentTarget } = e;
    if (isOverflow(currentTarget)) {
      Tooltip.show(currentTarget, {
        title: text,
        placement: 'top',
      });
    }
  };

  const handleMouseLeave = () => {
    Tooltip.hide();
  };

  const renderAppId = ({ text }:{text:string}) => (
    <div
      onMouseEnter={(e) => { handleMouseEnter(e, text); }}
      onMouseLeave={handleMouseLeave}
      className={`${prefixCls}-form-item`}
    >
      {text}
    </div>
  );

  const renderAppSecret = ({ text }:{text:string}) => (
    <div
      onMouseEnter={(e) => { handleMouseEnter(e, text); }}
      onMouseLeave={handleMouseLeave}
      className={`${prefixCls}-form-item`}
    >
      {text}
    </div>
  );

  return (
    <TabPage
      className={prefixCls}
      service={['choerodon.code.organization.setting.general-setting.ps.info']}
      // service={['choerodon.code.organization.setting.general-setting.ps.thirdpartyapp']}
    >
      <Header />

      <Breadcrumb />

      <Content>
        <div className={`${prefixCls}-app-list`}>
          {
            formDs.map((record: Record) => (
              <div className={`${prefixCls}-app-list-item`}>
                <div className={`${prefixCls}-app-list-item-header`}>
                  <img className="bg-img" src={getImg(record, 'bg')} alt="" />
                  <div className="left">
                    <span className="left-item">
                      <img src={getImg(record, 'logo')} alt="" />
                    </span>
                    <span className="app-name left-item">{getName(record)}</span>
                    <span className="left-item">
                      <StatusTag
                        colorCode={record?.get('enabledFlag') ? 'success' : 'lost'}
                        name={record?.get('enabledFlag') ? '启用' : '停用'}
                      />
                    </span>

                  </div>
                  <div className="right">
                    <Action data={getActionData(record)} />
                  </div>
                </div>
                <div className={`${prefixCls}-form-container`}>
                  <div className={`${prefixCls}-form-content`}>
                    <Form
                      record={record}
                      labelLayout={'horizontal' as any}
                      labelAlign={'left' as any}
                      style={{ width: 240, marginRight: 250 }}
                    >
                      <Output
                        label={(
                          <span className={`${prefixCls}-form-title`}>
                            基本信息
                          </span>
                        )}
                      />
                      <Output name="appId" renderer={renderAppId} />
                      <Output name="appSecret" renderer={renderAppSecret} />
                      <Output label="申请权限" renderer={renderApplyPermission} />
                    </Form>

                    <Form
                      record={record}
                      labelLayout={'horizontal' as any}
                      labelAlign={'left' as any}
                      style={{ width: 240 }}
                    >
                      <Output
                        label={(
                          <span className={`${prefixCls}-form-title`}>
                            用户信息
                          </span>
                        )}
                      />
                      <Output
                        name="openAppConfigVO.loginNameField"
                        label={(
                          <span>
                            登录名
                            <NewTips style={{ marginLeft: 3 }} helpText="登录名属于猪齿鱼系统必填项且要求平台唯一，默认使用钉钉的userid字段作为登录名。" />
                          </span>
                        )}
                      />
                      <Output
                        label={(
                          <span>
                            邮箱
                            <NewTips style={{ marginLeft: 3 }} helpText="邮箱属于猪齿鱼系统必填项，请确保钉钉有邮箱，否则将同步失效。" />
                          </span>
                        )}
                        name="openAppConfigVO.emailField"
                      />
                      <Output name="openAppConfigVO.realNameField" />
                      <Output name="openAppConfigVO.phoneField" />
                    </Form>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </Content>
    </TabPage>
  );
};

export default observer(PageContent);

/* eslint-disable */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'choerodon-ui/pro';
import Cookies from 'universal-cookie';
import { Page, Content, Breadcrumb } from '@choerodon/boot';
import { useHzeroPageStore } from './stores';
import {
   Header, HeaderButtons,
} from '@choerodon/boot';
import {syncRolesApi} from '@/api/syncRole';

import './index.less';
import openCreateNotification from '@choerodon/master/lib/components/notification';

const cookies = new Cookies();

const getCookie = (name, option) => cookies.get(name, option);

const HzeroPage = withRouter(((props) => {
  const {
    prefixCls,
    intlPrefix,
    intl: { formatMessage },
    pageType,
    onClick,
    projectId,
  } = useHzeroPageStore();

  function handleClick() {
    const url = {
      user: 'hiam/sub-account-site',
      role: 'hiam/role/list',
      menu: 'hiam/menu',
      instance: 'hadm/instance',
      api: 'hadm/api-overview',
      'api-test': 'hadm/api-test',
    };
    // eslint-disable-next-line no-underscore-dangle,camelcase
    const access_token = getCookie('access_token', { path: '/' });
    const tokenType = getCookie('token_type', { path: '/' });
    // eslint-disable-next-line camelcase
    window.open(`${window._env_.HZERO_FRONT || process.env.HZERO_FRONT}/${url[pageType]}#access_token=${access_token}&token_type=${tokenType}`);
  }
const loadData=async()=>{
  const res=await syncRolesApi.getStatus();
   return ({status:res.status,progress:(res.completedStepCount/res.allStepCount)*100});
}
  const handleSystemFresh= async ()=>{
    const res=await syncRolesApi.SyncPermission();
    if(res){
      openCreateNotification({
        notificationKey:projectId,
        loadProgress:()=>loadData(),
        textObject:{
          failed:{
            title:'失败',
            description:''
          },
          success:{
            title:'成功',
            description:''
          },
          doing:{
            title:'系统权限刷新',
            description:'正在系统权限刷新，该过程可能会持续几分钟'
          },

        }

      })
    }
  }
  return (
    <Page>
      {pageType==='role'&&<Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: '系统权限刷新',
            icon: 'refresh',
            display: true,
            handler: handleSystemFresh,
          }])}
        />
      </Header>}
      <Breadcrumb />
      <Content className={`${prefixCls}`}>
        <div className={`${prefixCls}-wrap`}>
          <div className={`${prefixCls}-image`} />
          <div className={`${prefixCls}-text`}>
            <div className={`${prefixCls}-title`}>
              {formatMessage({ id: `${intlPrefix}.${pageType}.title` })}
            </div>
            <div className={`${prefixCls}-des`}>
              {formatMessage({ id: `${intlPrefix}.${pageType}.describe` })}
            </div>
            <Button
              color="primary"
              onClick={onClick || handleClick}
              funcType="raised"
            >
              {formatMessage({ id: `${intlPrefix}.link` })}
            </Button>
          </div>
        </div>
      </Content>
    </Page>
  );
}));

export default HzeroPage;

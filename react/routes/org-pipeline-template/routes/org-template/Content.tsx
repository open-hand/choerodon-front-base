import React, { useState, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { get } from '@choerodon/inject';
import {
  Page, Breadcrumb, Content, HeaderButtons, Header, devopsOrganizationsApi,
} from '@choerodon/master';
import { withRouter } from 'react-router-dom';
import { message, Tabs } from 'choerodon-ui';
import { omit } from 'lodash';
import {
  MAVEN_BUILD, CUSTOM_BUILD, PIPELINE_TEMPLATE, TASK_TEMPLATE, STEP_TEMPLATE,
} from '@choerodon/devops/lib/routes/app-pipeline/CONSTANTS.js';
import { useMainStore } from './stores';
import PinelineTable from './components/pinelineTable';
import StepsTable from './components/stepsTable';
import TaskTable from './components/taskTable';
import './index.less';

const { TabPane } = Tabs;
const PipelineTemplate = (props: any) => {
  const {
    history,
    location: { search, pathname },
  } = props;
  const {
    prefixCls,
    intlPrefix,
    pinelineTempRefresh,
    stepsTempRefresh,
    taskTempRefresh,
    formatClient,
    taskTableDs,
    stepsTableDs,
  } = useMainStore();

  const pipelineTempCreate = (tempId: string) => {
    history.push({
      pathname: `${pathname}/edit/create/${tempId}`,
      search,
    });
  };
  const pipelineTempEdit = (tempId: string) => { // 编辑
    history.push({
      pathname: `${pathname}/edit/edit/${tempId}`,
      search,
    });
  };

  const tempOperation = async (
    type: string,
    template: string,
    record?: any,
    actionType?: 'create' | 'edit',
  ) => { // 任务和步骤模板 修改或基于模板 创建
    if (!actionType) {
      // eslint-disable-next-line no-param-reassign
      actionType = 'create';
    }
    let tasksDetails = {};
    const namePart1 = actionType === 'create' ? '创建' : '修改';
    const namePart2 = type === 'normal' ? '任务模板' : '步骤模板';

    if (record && type === 'normal') {
      tasksDetails = await devopsOrganizationsApi.getOrgTasksTemplateDetail(record.id);
    }

    let data = {
      template,
      ...record,
      ...tasksDetails,
      type,
    };

    if (actionType === 'create') { // 创建不传id 并且把 名字置空
      data = omit(data, ['id']);
      data.name = '';
    }

    get('devops:handlePipelineModal')(
      {
        data,
        modalProps: {
          okText: namePart1,
          title: namePart1 + namePart2,
        },
        callback: async (callBackData: any) => {
          // 任务模板 ，模板维护方式为普通创建 必须有步骤配置
          if (data.type === 'normal' && !callBackData.devopsCiStepVOList.length) {
            message.warning('请添加步骤配置!');
            return false;
          }

          // 任务模板创建
          if (type === 'normal' && actionType === 'create') {
            await devopsOrganizationsApi.createOrgTasksTemplate({
              ...callBackData,
            });
            message.success('创建成功');
            taskTempRefresh();
          }
          // 任务模板修改
          if (type === 'normal' && actionType === 'edit') {
            await devopsOrganizationsApi.modifyOrgTasksTemplate({
              ...callBackData,
              id: record.id,
            });
            message.success('修改成功');
            taskTempRefresh();
          }
          // 步骤模板创建
          if (type === 'custom' && actionType === 'create') {
            await devopsOrganizationsApi.createOrgStepsTemplate({
              ...callBackData,
              type: 'custom',
            });
            message.success('创建成功');
            stepsTempRefresh();
          }
          // 步骤模板编辑
          if (type === 'custom' && actionType === 'edit') {
            await devopsOrganizationsApi.modifyOrgStepsTemplate({
              ...callBackData,
              id: record.id,
            });
            message.success('修改成功');
            stepsTempRefresh();
          }
        },
        level: 'organization',
      },
    );
  };

  const panes = useMemo(() => [
    {
      key: 'pineline-temp',
      tab: formatClient({ id: 'pipeline.pipelineTemplate' }),
      child: <PinelineTable
        pipelineTempCreate={pipelineTempCreate}
        pipelineTempEdit={pipelineTempEdit}
      />,
      headerBtns: [
        {
          name: formatClient({ id: 'pipeline.create' }),
          icon: 'playlist_add',
          handler: () => { pipelineTempCreate('default'); },
        },
        {
          icon: 'refresh',
          handler: pinelineTempRefresh,
        },
      ],
    },
    {
      key: 'task-temp',
      tab: formatClient({ id: 'tasks.tasksTemplate' }),
      child: <TaskTable tempOperation={(record: any, actionType: 'create' | 'edit') => { tempOperation(MAVEN_BUILD, TASK_TEMPLATE, record, actionType); }} />,
      headerBtns: [
        {
          name: formatClient({ id: 'tasks.create' }),
          icon: 'playlist_add',
          handler: () => { tempOperation(MAVEN_BUILD, TASK_TEMPLATE); },
        },
        {
          icon: 'refresh',
          handler: taskTempRefresh,
        },
      ],
    },
    {
      key: 'steps-temp',
      tab: formatClient({ id: 'steps.stepsTemplate' }),
      child: <StepsTable tempOperation={(record: any, actionType: 'create' | 'edit') => {
        tempOperation(CUSTOM_BUILD, STEP_TEMPLATE, record, actionType);
      }}
      />,
      headerBtns: [
        {
          name: formatClient({ id: 'steps.create' }),
          icon: 'playlist_add',
          handler: () => { tempOperation(CUSTOM_BUILD, STEP_TEMPLATE); },
        },
        {
          icon: 'refresh',
          handler: stepsTempRefresh,
        },
      ],
    },
  ], []);

  const [activeKey, setActiveKey] = useState('pineline-temp');

  function getActiveKeyIndex(key: string) {
    let activeIndex;
    panes.forEach((item, index) => {
      if (item.key === key) {
        activeIndex = index;
      }
    });
    return activeIndex;
  }

  const tabsChange = (key: string) => {
    if (activeKey !== key) {
      setActiveKey(key);
      // @ts-ignore
      const arr = panes[getActiveKeyIndex(key)].headerBtns;
      arr[arr.length - 1].handler();
    }
  };
  // @ts-ignore
  // eslint-disable-next-line max-len
  const headerBtns = useMemo(() => () => panes[getActiveKeyIndex(activeKey)].headerBtns, [activeKey]);
  return (
    <Page service={['choerodon.code.organization.manager.pipeline.template.ps.default']}>
      <Header>
        <HeaderButtons items={headerBtns()} />
      </Header>
      <Breadcrumb />
      <Content className={prefixCls}>
        <Tabs activeKey={activeKey} onChange={tabsChange}>
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
export default withRouter(observer(PipelineTemplate));

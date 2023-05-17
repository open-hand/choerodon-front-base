import React, {
  useEffect, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  CONSTANTS,
} from '@choerodon/boot';

import {
  Modal,
} from 'choerodon-ui/pro';
import { } from '@choerodon/components';
import {
  Page, Breadcrumb, Content, HeaderButtons, Header,
  pipelineTemplateApi,
} from '@choerodon/master';
import { Tabs, message } from 'choerodon-ui';

import { get as getInject } from '@choerodon/inject';
import {
  CUSTOM_BUILD, STEP_TEMPLATE, TASK_TEMPLATE, MAVEN_BUILD,
} from '@choerodon/devops/lib/routes/app-pipeline/CONSTANTS.js';
import { usePipelineTemplateStore } from './stores';
import PipelineTemplateTable from './components/pipelineTemplateTable';
import StepTemplateTable from './components/stepTemplateTable';
import StepClassManagement from './components/step-class-manage';
import TaskGroupManagement from './components/task-group-manage';
import PipelineClassManagement from './components/pipeline-class-manage';
import TaskTemplateTable from './components/taskTemplateTable';

const { TabPane } = Tabs;
const stepClassManagementModalKey = Modal.key();
const taskGroupManagementModalKey = Modal.key();
const PipelineTemplate = (props: any) => {
  const {
    mainStore,
    prefixCls,
    formatPipelineTemplate,
    formatCommon,
    taskTemplateRefresh,
    refresh,
    stepTemplateRefresh,
    handleEdit,
    handleCreate,
  } = usePipelineTemplateStore();

  const [activeKey, setActiveKey] = useState('1');
  useEffect(() => {
  }, []);

  const panes = [
    {
      tab: formatPipelineTemplate({ id: 'pipelineTemplate' }),
      key: '1',
      child: <PipelineTemplateTable />,
    },
    {
      tab: formatPipelineTemplate({ id: 'taskTemplate' }),
      key: '2',
      child: <TaskTemplateTable />,
    },
    {
      tab: formatPipelineTemplate({ id: 'stepTemplate' }),
      key: '3',
      child: <StepTemplateTable />,
    },
  ];

  const tabsChange = (key: string) => {
    setActiveKey(key);
    switch (key) {
      case '1':
        refresh();
        break;
      case '2':
        taskTemplateRefresh();
        break;
      case '3':
        stepTemplateRefresh();
        break;
      default:
        break;
    }
  };

  const {
    MODAL_WIDTH: {
      MIDDLE,
    },
  } = CONSTANTS;

  const handleStepClassManagement = () => {
    Modal.open({
      key: stepClassManagementModalKey,
      title: formatPipelineTemplate({ id: 'stepClassManagement' }),
      drawer: true,
      style: {
        width: MIDDLE,
      },
      okCancel: false,
      okText: formatCommon({ id: 'close' }),
      children: <StepClassManagement />,
    });
  };
  const handleTaskGroupManagement = () => {
    Modal.open({
      key: taskGroupManagementModalKey,
      title: formatPipelineTemplate({ id: 'taskGroupManagement' }),
      drawer: true,
      style: {
        width: MIDDLE,
      },
      okCancel: false,
      okText: formatCommon({ id: 'close' }),
      children: <TaskGroupManagement />,
    });
  };

  const handlePipeLineClassManagement = () => {
    Modal.open({
      key: taskGroupManagementModalKey,
      title: formatPipelineTemplate({ id: 'pipeLineClassManagement' }),
      drawer: true,
      style: {
        width: MIDDLE,
      },
      okCancel: false,
      okText: formatCommon({ id: 'close' }),
      children: <PipelineClassManagement handleEdit={handleEdit} />,
    });
  };

  const handleCreateTaskTemplate = () => {
    getInject('devops:handlePipelineModal')(
      {
        title: '创建任务模板',
        level: 'site',
        data: {
          type: MAVEN_BUILD,
          template: TASK_TEMPLATE,
        },
        callback: async (data:any) => {
          const params = {
            ...data,
            builtIn: false,
            devopsCiStepVOList: data.devopsCiStepVOList,
            groupId: data.groupId,
            image: data.image,
            name: data.name,
            script: data.script,
            sequence: data.devopsCiStepVOList[0]?.sequence,
            sourceId: 0,
            sourceType: 'site',
            toDownload: data.toDownload ? data.toDownload : false,
            toUpload: data.toUpload ? data.toUpload : false,
            type: data.type,
          };
          const res = await pipelineTemplateApi.createTaskTemplate(params);
          try {
            if (res && !res.failed) {
              message.info('创建成功');
              taskTemplateRefresh();
              return true;
            }
            return false;
          } catch (error) {
            return error;
          }
        },
      },
    );
  };

  const handleCreateStepTemplate = () => {
    getInject('devops:handlePipelineModal')(
      {
        title: '创建步骤模板',
        level: 'site',
        data: {
          type: CUSTOM_BUILD,
          template: STEP_TEMPLATE,
        },
        callback: async (data:any) => {
          const params = {
            ...data,
            categoryId: data.categoryId,
            builtIn: false,
            name: data.name,
            script: data.script,
            sequence: data.sequence,
            sourceId: 0,
            sourceType: 'site',
            type: data.type,
          };
          const res = await pipelineTemplateApi.createStepTemplate(params);
          try {
            if (res && !res.failed) {
              message.info('创建成功');
              stepTemplateRefresh();
              return true;
            }
            return false;
          } catch (error) {
            return error;
          }
        },
      },
    );
  };

  const headerBtns = () => {
    switch (activeKey) {
      case '1':
        return [
          {
            name: formatPipelineTemplate({ id: 'creatPipeLineTemplate' }),
            icon: 'playlist_add',
            display: true,
            handler: handleCreate,
            // permissions: ['choerodon.code.site.manager.organization-approve.ps.blacklistEdit'],
          },
          {
            name: formatPipelineTemplate({ id: 'pipeLineClassManagement' }),
            icon: 'settings-o',
            display: true,
            handler: () => handlePipeLineClassManagement(),
            // permissions: ['choerodon.code.site.manager.organization-approve.ps.blacklistEdit'],
          },
          {
            icon: 'refresh',
            handler: refresh,
          },
        ];
      case '2':
        return [
          {
            name: formatPipelineTemplate({ id: 'creatTaskTemplate' }),
            icon: 'playlist_add',
            display: true,
            handler: () => handleCreateTaskTemplate(),
            // permissions: ['choerodon.code.site.manager.organization-approve.ps.blacklistEdit'],
          },
          {
            name: formatPipelineTemplate({ id: 'taskGroupManagement' }),
            icon: 'settings-o',
            display: true,
            handler: () => handleTaskGroupManagement(),
            // permissions: ['choerodon.code.site.manager.organization-approve.ps.blacklistEdit'],
          },
          {
            icon: 'refresh',
            handler: taskTemplateRefresh,
          },
        ];
      case '3':
        return [
          {
            name: formatPipelineTemplate({ id: 'creatStepTemplate' }),
            icon: 'playlist_add',
            display: true,
            handler: () => handleCreateStepTemplate(),
            // permissions: ['choerodon.code.site.manager.organization-approve.ps.blacklistEdit'],
          },
          {
            name: formatPipelineTemplate({ id: 'stepClassManagement' }),
            icon: 'settings-o',
            display: true,
            handler: () => handleStepClassManagement(),
            // permissions: ['choerodon.code.site.manager.organization-approve.ps.blacklistEdit'],
          },
          {
            icon: 'refresh',
            handler: stepTemplateRefresh,
          },
        ];
      default:
        break;
    }
    return [];
  };
  return (
    <Page>
      {/* TODO 按钮的权限 */}
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

export default observer(PipelineTemplate);

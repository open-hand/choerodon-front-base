import React from 'react';
import { mount } from '@choerodon/inject';
import { pipelineTemplateApi } from '@choerodon/master';
import { useLocation, useHistory, useRouteMatch } from 'react-router';
import { message } from 'choerodon-ui/pro';
import BasicInfo from '@/components/pipeline/index';
import { DEFAULT_STAGES_DATA, DEFAULT_BASICINFO } from './constant';

const Index = () => {
  const history = useHistory();
  const match = useRouteMatch();

  const { search, state } = useLocation();

  const getTemplateStageVOS = (data:any) => {
    const templateStageVOS = data.flowConfiguration.map((item:any) => ({
      ciTemplateJobVOList: item?.jobList,
      name: item.name,
    }));
    return templateStageVOS;
  };

  const handlePinelineTemplate = async (tempId: any) => {
    const res = await pipelineTemplateApi.getPinelineTemplateById(tempId);
    res.templateStageVOS = res.templateStageVOS.map((item: any) => {
      if (item.ciTemplateJobVOList) {
        item.jobList = item.ciTemplateJobVOList;
      }
      return item;
    });
    return res;
  };

  const getProcessedPinelineTempRes = async (tempId: any) => {
    const res = await pipelineTemplateApi.getPinelineTemplateById(tempId);
    res.name = '';
    return res;
  };

  const props = {
    // @ts-ignore
    HomePage: React.lazy(() => import('@/routes/site-pipeline-template/routes/pipeline-template')),
    level: 'site',
    permissions: { editPagePermissions: ['choerodon.code.site.manager.pipeline.template.createOrEdit'] },
    defaultTabKey: 'basicInfo',
    basicInfo: {
      Component: <BasicInfo level="site" />,
      key: 'basicInfo',
    },
    onCreate: async (data:any) => {
      if (!data.basicInfo.name) {
        return false;
      }
      const params = {
        builtIn: false,
        ciTemplateCategoryId: data.basicInfo.ciTemplateCategoryId,
        enable: true,
        name: data.basicInfo.name,
        sourceId: 0,
        sourceType: 'site',
        templateStageVOS: getTemplateStageVOS(data),
        versionName: data.advancedSettings.versionName,
        image: data.advancedSettings.image,
        ciTemplateVariableVOS: data.ciConfigs,
      };
      const res = await pipelineTemplateApi.createPinelineTemplate(params);
      try {
        if (res && !res.failed) {
          history.push({
            pathname: match.url,
            search,
          });
          message.info('创建成功');
          return true;
        }
        return false;
      } catch (error) {
        return error;
      }
    },
    onSave: async (data:any) => {
      if (!data.basicInfo.name) {
        return false;
      }
      const params = {
        id: (state as any).id,
        builtIn: false,
        ciTemplateCategoryId: data.basicInfo.ciTemplateCategoryId,
        enable: true,
        name: data.basicInfo.name,
        sourceId: 0,
        sourceType: 'site',
        templateStageVOS: getTemplateStageVOS(data),
        versionName: data.advancedSettings.versionName,
        ciTemplateVariableVOS: data.ciConfigs,
        image: data.advancedSettings.image,
      };
      const res = await pipelineTemplateApi.editPinelineTemplate(params);
      try {
        if (res && !res.failed) {
          history.push({
            pathname: match.url,
            search,
          });
          message.info('修改成功');
          return true;
        }
        return false;
      } catch (error) {
        return error;
      }
    },
    tabApis: {
      basicInfo: {
        create: (tempId: any) => (tempId === 'default' ? new Promise((resolve, reject) => resolve(DEFAULT_BASICINFO)) : new Promise((resolve, reject) => resolve(getProcessedPinelineTempRes(tempId)))),
        modify: (tempId: any) => pipelineTemplateApi.getPinelineTemplateById(tempId),
      },
      advancedSettings: {
        create: (tempId: any) => (tempId === 'default' ? new Promise((resolve, reject) => resolve(DEFAULT_STAGES_DATA)) : pipelineTemplateApi.getPinelineTemplateById(tempId)),
        modify: (tempId: any) => pipelineTemplateApi.getPinelineTemplateById(tempId),
      },
      ciConfigs: {
        create: (tempId: any) => (tempId === 'default' ? new Promise((resolve, reject) => resolve([])) : pipelineTemplateApi.getVariableById(tempId)),
        modify: (tempId: any) => pipelineTemplateApi.getVariableById(tempId),
      },
      flowConfiguration: {
        create: (tempId: any) => (tempId === 'default' ? new Promise((resolve, reject) => resolve(DEFAULT_STAGES_DATA))
          : new Promise((resolve, reject) => resolve(handlePinelineTemplate(tempId)))
        ),
        modify:
         (tempId: any) => new Promise((resolve, reject) => resolve(handlePinelineTemplate(tempId))),
      },
    },
    jobGroupsApi: pipelineTemplateApi.getTaskGroupList(),
    jobPanelApiCallback:
     (jobGroupId: any) => pipelineTemplateApi.getTasksTemplateListByGroupId(jobGroupId),
  };

  return mount('devops:AppPipeline', props);
};

export default Index;

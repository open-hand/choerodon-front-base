import React from 'react';
import { mount } from '@choerodon/inject';
import { devopsOrganizationsApi } from '@choerodon/master';
import { withRouter } from 'react-router-dom';
import { message } from 'choerodon-ui';
import BasicInfo from '@/components/pipeline/index';
import { DEFAULT_STAGES_DATA, DEFAULT_BASICINFO } from './constant';

const Index = (prop: any) => {
  const { history, location: { search } } = prop;

  const getProcessedPinelineTempRes = async (tempId: any) => {
    const res = await devopsOrganizationsApi.getOrgPinelineTemplateById(tempId);
    res.name = '';
    return res;
  };

  const handlePinelineTemplate = async (tempId: any) => {
    const res = await devopsOrganizationsApi.getOrgPinelineTemplateById(tempId);
    res.templateStageVOS = res.templateStageVOS.map((item: any) => {
      if (item.ciTemplateJobVOList) {
        // eslint-disable-next-line no-param-reassign
        item.jobList = item.ciTemplateJobVOList;
      }
      return item;
    });
    return res;
  };

  const validateData = async (data: any, setTabKey: any) => {
    const { basicInfo: { name }, advancedSettings: { image } } = data;
    // eslint-disable-next-line camelcase
    let ci_pipeline_template_id;
    const ajaxObj: any = {};
    if (window.location.href.indexOf('edit/edit') !== -1) {
      // eslint-disable-next-line prefer-destructuring,camelcase
      ci_pipeline_template_id = window.location.href
        .split('edit/edit/')[1]
        .split('?')[0];
      // eslint-disable-next-line camelcase
      ajaxObj.ci_pipeline_template_id = ci_pipeline_template_id;
    }
    ajaxObj.name = name;
    if (!name || name.length > 120 || !await devopsOrganizationsApi.checkOrgPinelineName(ajaxObj)) {
      setTabKey('basicInfo');
      return false;
    }
    if (!image || image.length > 120) {
      setTabKey('advancedSettings');
      return false;
    }
    return true;
  };

  const props = {
    // @ts-ignore
    HomePage: React.lazy(() => import('@/routes/org-pipeline-template/routes/org-template/index')),
    level: 'organization',
    defaultTabKey: 'basicInfo',
    permissions: { editPagePermissions: ['choerodon.code.organization.manager.pipeline.template.createOrEdit'] },
    basicInfo: {
      Component: <BasicInfo level="organization" />,
      key: 'basicInfo',
    },
    onCreate: async (data: any, setTabKey: any) => {
      if (await validateData(data, setTabKey)) {
        const {
          basicInfo: { ciTemplateCategoryId, name },
          flowConfiguration, ciConfigs, advancedSettings: {
            image, versionName, versionNameRules, versionStrategy,
          },
        } = data;
        const templateStageVOS = flowConfiguration.map(
          (item: any) => {
            let obj = {};
            if (item.jobList) {
              // @ts-ignore
              obj.ciTemplateJobVOList = item.jobList;
            }
            const { name: itemName, type } = item;
            obj = { ...obj, name: itemName, type };
            return obj;
          },
        );
        const postObj = {
          builtIn: false,
          ciTemplateCategoryId,
          enable: true,
          image,
          name,
          sourceType: 'organization',
          templateStageVOS,
          versionName: !versionStrategy ? '' : versionName,
          ciTemplateVariableVOS: ciConfigs,
        };
        try {
          await devopsOrganizationsApi.createOrgPinelineTemplate(postObj);
          message.success('创建成功');
          history.push({
            pathname: '/iam/org-pipeline-template',
            search,
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    onSave: async (data: any, setTabKey: any) => {
      if (await validateData(data, setTabKey)) {
        const {
          basicInfo: { ciTemplateCategoryId, name },
          flowConfiguration, ciConfigs, advancedSettings: {
            image, versionName, versionNameRules, versionStrategy,
          },
        } = data;
        const templateStageVOS = flowConfiguration.map(
          (item: any) => {
            let obj = {};
            if (item.jobList) {
              // @ts-ignore
              obj.ciTemplateJobVOList = item.jobList;
            }
            const { name: itemName, type } = item;
            obj = { ...obj, name: itemName, type };
            return obj;
          },
        );
        try {
          await devopsOrganizationsApi.modifyOrgPinelineTemplate(
            {
              builtIn: false,
              ciTemplateCategoryId,
              enable: true,
              image,
              name,
              sourceType: 'organization',
              templateStageVOS,
              versionName: !versionStrategy ? '' : versionName,
              ciTemplateVariableVOS: ciConfigs,
              id: window.location.href.split('edit/edit/')[1].split('?')[0],
            },
          );
          message.success('修改成功');
          history.push({
            pathname: '/iam/org-pipeline-template',
            search,
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    tabApis: {
      basicInfo: {
        create: (tempId: any) => (
          tempId === 'default' ? new Promise((resolve, reject) => resolve(DEFAULT_BASICINFO))
            : new Promise((resolve, reject) => resolve(getProcessedPinelineTempRes(tempId)))
        ),
        modify: (tempId: any) => devopsOrganizationsApi.getOrgPinelineTemplateById(tempId),
      },
      advancedSettings: {
        create: (tempId: any) => (tempId === 'default' ? new Promise((resolve, reject) => resolve('')) : devopsOrganizationsApi.getOrgPinelineTemplateById(tempId)),
        modify: (tempId: any) => devopsOrganizationsApi.getOrgPinelineTemplateById(tempId),
      },
      ciConfigs: {
        create: (tempId: any) => (tempId === 'default' ? new Promise((resolve, reject) => resolve([])) : devopsOrganizationsApi.getOrgPinelineVariableById(tempId)),
        modify: (tempId: any) => devopsOrganizationsApi.getOrgPinelineVariableById(tempId),
      },
      flowConfiguration: {
        create: (tempId: any) => (
          tempId === 'default' ? new Promise((resolve, reject) => resolve(DEFAULT_STAGES_DATA))
            : new Promise((resolve, reject) => resolve(handlePinelineTemplate(tempId)))
        ),
        // eslint-disable-next-line max-len
        modify: (tempId: any) => new Promise((resolve, reject) => resolve(handlePinelineTemplate(tempId))),
      },
    },
    jobGroupsApi: devopsOrganizationsApi.getOrgTasksTemplateGroupList(),
    // eslint-disable-next-line max-len
    jobPanelApiCallback: (jobGroupId: any) => devopsOrganizationsApi.getOrgTasksTemplateListByGroupId(jobGroupId),
  };
  return mount('devops:AppPipeline', props);
};

export default withRouter(Index);

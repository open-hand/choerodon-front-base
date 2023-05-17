import { devopsOrganizationsApi, pipelineTemplateApi } from '@choerodon/master';
import { useLocation } from 'react-router';
/* eslint-disable max-len */
export default (level: string, setSavedData: any): any => {
  const { state } = useLocation();
  return ({
    autoCreate: true,
    autoQuery: false,
    selection: false,
    fields: [
      {
        name: 'name',
        type: 'string',
        label: '流水线模板名称',
        required: true,
        validator: async (value: any) => {
          let checkRes;
          const ajaxObj: any = {};
          let ci_pipeline_template_id;
          if (window.location.href.indexOf('edit/edit') !== -1) {
            ci_pipeline_template_id = window.location.href
              .split('edit/edit/')[1]
              .split('?')[0];
            ajaxObj.ci_pipeline_template_id = ci_pipeline_template_id;
          }
          ajaxObj.name = value;

          const id = (state as any)?.id;

          if (level === 'organization') {
            checkRes = await devopsOrganizationsApi.checkOrgPinelineName(ajaxObj);
          } else if (level === 'site') {
            checkRes = await pipelineTemplateApi.checkCreatePipelineName({ name: value, id });
          }
          if (!checkRes) {
            return '流水线模板名称必须唯一';
          }
          return checkRes;
        },
        maxLength: 120,
      },
      {
        name: 'ciTemplateCategoryId',
        type: 'string',
        label: '流水线分类',
        required: true,
      },
    ],
    events: {
      update: ({
        dataSet, record, name, value, oldValue,
      }: any) => {
        setSavedData(dataSet.toData()[0]);
      },
    },
  });
};

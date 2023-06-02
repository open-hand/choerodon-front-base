/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';
import omit from 'lodash/omit';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { pipelineTemplateApi } from '@choerodon/master';

interface ModifyStepClassProps{
    formatModifyStepClass: any,
  formatCommon: any,
  isEdit:boolean|undefined,
  record:Record|undefined
}
export default ({
  formatModifyStepClass, formatCommon, isEdit, record,
}:ModifyStepClassProps):any => {
  async function checkName(value:string, name:string, newRecord:any) {
    try {
      let res;
      if (newRecord.get('id')) {
        res = await pipelineTemplateApi.checkStepClassName('0', value, newRecord.get('id'));
      } else {
        res = await pipelineTemplateApi.checkStepClassName('0', value);
      }
      if (!res) {
        return '名称已存在';
      }
      return true;
    } catch (error) {
      return error.message;
    }
  }
  return {
    autoCreate: true,
    autoQuery: false,
    selection: false,
    datatojson: false,
    fields: [
      {
        name: 'name', type: 'string', label: formatModifyStepClass({ id: 'name' }), required: 'true', validator: checkName, maxLength: 30,
      },
    ],
    transport: {
      create: ({ data: [data] }:any) => {
        const postData = { builtIn: false, ...omit(data, ['__id', '__status']) };
        return ({
          url: '/devops/v1/site/0/ci_template_step_category',
          method: 'post',
          data: postData,
        });
      },
      update: ({ data: [data] }:any) => {
        const putData = omit(data, ['__id', '__status']);
        return ({
          url: '/devops/v1/site/0/ci_template_step_category',
          method: 'put',
          data: putData,
        });
      },
    },
  };
};

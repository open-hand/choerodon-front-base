/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';
import omit from 'lodash/omit';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { pipelineTemplateApi } from '@choerodon/master';

interface ModifyPipelineClassProps{
  formatModifyPipelineClass: any,
  formatCommon: any,
}
export default ({
  formatModifyPipelineClass, formatCommon,
}:ModifyPipelineClassProps):any => {
  async function checkName(value:string, name:string, record:any) {
    try {
      let res;
      if (record.get('id')) {
        res = await pipelineTemplateApi.checkPipelineClassName('0', value, record.get('id'));
      } else {
        res = await pipelineTemplateApi.checkPipelineClassName('0', value);
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
        name: 'category', type: 'string', label: formatModifyPipelineClass({ id: 'name' }), required: 'true', validator: checkName, maxLength: 30,
      },
    ],
    transport: {
      create: ({ data: [data] }:any) => {
        const postData = { builtIn: false, ...omit(data, ['__id', '__status']) };
        return ({
          url: '/devops/v1/site/0/ci_template_category',
          method: 'post',
          data: postData,
        });
      },
      update: ({ data: [data] }:any) => {
        const putData = omit(data, ['__id', '__status']);
        return ({
          url: '/devops/v1/site/0/ci_template_category',
          method: 'put',
          data: putData,
        });
      },
    },
  };
};

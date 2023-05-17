/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';
import { pipelineTemplateApiConfig } from '@choerodon/master';

interface PipelineTemplateProps{
  formatPipelineTemplate: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
  sourceDs:DataSet,
  enableDs:DataSet,
}
export default ({
  formatPipelineTemplate, formatCommon, sourceDs, enableDs,
}:PipelineTemplateProps):any => ({
  autoQuery: true,
  selection: false,
  fields: [
    { name: 'name', type: 'string', label: formatPipelineTemplate({ id: 'pipelineTemplateName' }) },
    { name: 'ciTemplateCategoryVO', type: 'object', label: formatPipelineTemplate({ id: 'pipelineCategory' }) },
    { name: 'creator', type: 'string', label: formatPipelineTemplate({ id: 'creator' }) },
    { name: 'creationDate', type: 'string', label: formatPipelineTemplate({ id: 'creationDate' }) },
    { name: 'builtIn', type: 'boolean', label: formatPipelineTemplate({ id: 'builtIn' }) },
    { name: 'enable', type: 'boolean', label: formatPipelineTemplate({ id: 'enable' }) },
  ],

  queryFields: [
    { name: 'name', type: 'string', label: formatPipelineTemplate({ id: 'pipelineTemplateName' }) },
    {
      name: 'category_id',
      textField: 'category',
      valueField: 'id',
      lookupAxiosConfig: () => (
        pipelineTemplateApiConfig.getSitePinelineCategory()),
      type: 'string',
      label: formatPipelineTemplate({ id: 'pipelineCategory' }),
    },
    {
      name: 'builtIn', type: 'string', textField: 'text', valueField: 'value', options: sourceDs, label: formatPipelineTemplate({ id: 'builtIn' }),
    },
    {
      name: 'enable', type: 'string', textField: 'text', valueField: 'value', options: enableDs, label: formatPipelineTemplate({ id: 'enable' }),
    },
  ],
  transport: {
    read: {
      url: '/devops/v1/site/0/ci_pipeline_template',
      method: 'get',
    },
  },
});

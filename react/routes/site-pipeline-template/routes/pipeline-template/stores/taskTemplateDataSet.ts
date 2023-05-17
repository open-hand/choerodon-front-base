/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';
import { pipelineTemplateApiConfig } from '@choerodon/master';

interface TaskTemplateProps{
  formatPipelineTemplate: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
  sourceDs:DataSet,
}
export default ({
  formatPipelineTemplate, formatCommon, sourceDs,
}:TaskTemplateProps):any => ({
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'name', type: 'string', label: formatPipelineTemplate({ id: 'taskTemplateName' }) },
    { name: 'groupName', type: 'string', label: formatPipelineTemplate({ id: 'groupName' }) },
    { name: 'stepNumber', type: 'string', label: formatPipelineTemplate({ id: 'stepNumber' }) },
    { name: 'creator', type: 'object', label: formatPipelineTemplate({ id: 'creator' }) },
    { name: 'creationDate', type: 'string', label: formatPipelineTemplate({ id: 'creationDate' }) },
    { name: 'builtIn', type: 'string', label: formatPipelineTemplate({ id: 'builtIn' }) },
  ],

  queryFields: [
    { name: 'name', type: 'string', label: formatPipelineTemplate({ id: 'stepName' }) },
    {
      name: 'builtIn', type: 'string', textField: 'text', valueField: 'value', options: sourceDs, label: formatPipelineTemplate({ id: 'builtIn' }),
    },
    {
      name: 'group_id',
      type: 'string',
      textField: 'name',
      valueField: 'id',
      lookupAxiosConfig: () => (
        pipelineTemplateApiConfig.getSiteJobCategory()),
      label: formatPipelineTemplate({ id: 'groupName' }),
    },
  ],
  transport: {
    read: {
      url: '/devops/v1/site/0/ci_template_job/page',
      method: 'get',
    },
  },
});

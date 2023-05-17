/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';

interface StepClassManageProps{
  formatPipelineClassManage: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
}
export default ({
  formatPipelineClassManage, formatCommon,
}:StepClassManageProps):any => ({
  autoQuery: true,
  selection: false,
  paging: true,
  fields: [
    { name: 'category', type: 'string', label: formatPipelineClassManage({ id: 'pipelineTemplateName' }) },
    { name: 'templateNumber', type: 'string', label: formatPipelineClassManage({ id: 'templateNumber' }) },
    { name: 'creator', type: 'object', label: formatPipelineClassManage({ id: 'creator' }) },
    { name: 'creationDate', type: 'object', label: formatPipelineClassManage({ id: 'creationDate' }) },
  ],
  transport: {
    read: {
      url: '/devops/v1/site/0/ci_template_category',
      method: 'get',
    },
  },
});

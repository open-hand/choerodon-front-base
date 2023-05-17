/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';

interface StepClassManageProps{
  formatStepClassManage: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
}
export default ({
  formatStepClassManage, formatCommon,
}:StepClassManageProps):any => ({
  autoQuery: true,
  selection: false,
  paging: true,
  fields: [
    { name: 'name', type: 'string', label: formatStepClassManage({ id: 'categoryName' }) },

    { name: 'templateNumber', type: 'string', label: formatStepClassManage({ id: 'templateNumber' }) },
    { name: 'creator', type: 'object', label: formatStepClassManage({ id: 'creator' }) },
    { name: 'creationDate', type: 'object', label: formatStepClassManage({ id: 'creationDate' }) },
  ],

  transport: {
    read: {
      url: '/devops/v1/site/0/ci_template_step_category',
      method: 'get',
    },
  },
});

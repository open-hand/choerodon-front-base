/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { IntlFormatters } from 'react-intl';
import { pipelineTemplateApiConfig } from '@choerodon/master';

interface TaskGroupManageProps{
  formatTaskGroupManage: any,
  formatCommon: any,
}
export default ({
  formatTaskGroupManage, formatCommon,
}:TaskGroupManageProps):any => ({
  autoQuery: true,
  selection: false,
  paging: true,
  fields: [
    { name: 'name', type: 'string', label: formatTaskGroupManage({ id: 'taskGroupName' }) },
    { name: 'templateNumber', type: 'string', label: formatTaskGroupManage({ id: 'templateNumber' }) },
    { name: 'creator', type: 'object', label: formatTaskGroupManage({ id: 'creator' }) },
    { name: 'creationDate', type: 'string', label: formatTaskGroupManage({ id: 'creationDate' }) },
  ],

  transport: {
    read: () => pipelineTemplateApiConfig.getTaskTemplateGroupList('0'),
  },
});

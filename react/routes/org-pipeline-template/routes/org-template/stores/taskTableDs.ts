/* eslint-disable max-len */
import { DataSet } from 'choerodon-ui/pro';
import { devopsOrganizationsApiConfig } from '@choerodon/master';

export default ({ formatClient }: any): any => ({
  autoQuery: false,
  selection: false,
  fields: [
    {
      name: 'name',
      type: 'string',
      label: formatClient({ id: 'tasks.name' }),
    },
    {
      name: 'groupName',
      type: 'string',
      label: formatClient({ id: 'tasks.group' }),
    },
    {
      name: 'stepNumber',
      type: 'string',
      label: formatClient({ id: 'tasks.steps' }),
    },
    {
      name: 'createdBy',
      type: 'string',
      label: formatClient({ id: 'tasks.creator' }),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: formatClient({ id: 'tasks.creationDate' }),
    },
    {
      name: 'sourceType',
      type: 'string',
      label: formatClient({ id: 'tasks.sourceType' }),
    },
  ],
  queryFields: [
    { name: 'name', type: 'string', label: '模板名称' },
    {
      name: 'groupName',
      type: 'string',
      label: '所属任务分组',
      textField: 'name',
      valueField: 'name',
      lookupAxiosConfig: ({
        dataSet, record, params, lookupCode,
      }: any) => ({
        url: devopsOrganizationsApiConfig.getOrgTasksCategory().url,
        method: 'get',
      }),
    },
    {
      name: 'builtIn',
      type: 'string',
      label: '来源',
      textField: 'text',
      valueField: 'value',
      options: new DataSet({
        data: [
          {
            text: '预定义',
            value: 'false',
          },
          {
            text: '自定义',
            value: 'true',
          },
        ],
      }),
    },
  ],
  transport: {
    read: {
      url: devopsOrganizationsApiConfig.getOrgTasksTemplate().url,
      method: 'get',
    },
  },
});

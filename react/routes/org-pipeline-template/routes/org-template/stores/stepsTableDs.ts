/* eslint-disable max-len */
import { devopsOrganizationsApiConfig } from '@choerodon/master';
import { DataSet } from 'choerodon-ui/pro';

export default ({ formatClient }:any):any => ({
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'name', type: 'string', label: formatClient({ id: 'steps.name' }) },
    { name: 'categoryName', type: 'string', label: formatClient({ id: 'steps.group' }) },
    { name: 'createdBy', type: 'string', label: formatClient({ id: 'steps.creator' }) },
    { name: 'creationDate', type: 'string', label: formatClient({ id: 'steps.creationDate' }) },
    { name: 'sourceType', type: 'string', label: formatClient({ id: 'steps.sourceType' }) },
  ],
  queryFields: [
    { name: 'name', type: 'string', label: '模板名称' },
    {
      name: 'categoryName',
      type: 'string',
      label: '所属步骤分类',
      textField: 'name',
      valueField: 'name',
      lookupAxiosConfig: ({
        dataSet, record, params, lookupCode,
      }: any) => ({
        url: devopsOrganizationsApiConfig.getOrgStepsCategory().url,
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
      url: devopsOrganizationsApiConfig.getOrgStepsTemplate().url,
      method: 'get',
    },
  },
});

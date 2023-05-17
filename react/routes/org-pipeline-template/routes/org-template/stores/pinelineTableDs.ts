/* eslint-disable max-len */
import { devopsOrganizationsApiConfig } from '@choerodon/master';
import { DataSet } from 'choerodon-ui/pro';

export default ({ formatClient }: any): any => ({
  autoQuery: true,
  selection: false,
  fields: [
    {
      name: 'name',
      type: 'string',
      label: formatClient({ id: 'pipeline.name' }),
    },
    {
      name: 'ciTemplateCategoryVO.category',
      type: 'string',
      label: formatClient({ id: 'pipeline.classification' }),
    },
    {
      name: 'creator',
      type: 'string',
      label: formatClient({ id: 'pipeline.creator' }),
    },
    {
      name: 'creationDate',
      type: 'string',
      label: formatClient({ id: 'pipeline.creationDate' }),
    },
    {
      name: 'sourceType',
      type: 'string',
      label: formatClient({ id: 'pipeline.sourceType' }),
    },
    {
      name: 'enable',
      type: 'string',
      label: formatClient({ id: 'pipeline.status' }),
    },
  ],

  queryFields: [
    { name: 'name', type: 'string', label: '流水线模板名称' },
    {
      name: 'category_id',
      type: 'string',
      label: '流水线分类',
      textField: 'category',
      valueField: 'id',
      lookupAxiosConfig: ({
        dataSet, record, params, lookupCode,
      }: any) => ({
        url: devopsOrganizationsApiConfig.getOrgPinelineCategory().url,
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
    {
      name: 'enable',
      type: 'string',
      label: '状态',
      textField: 'text',
      valueField: 'value',
      options: new DataSet({
        data: [
          {
            text: '启用',
            value: 'true',
          },
          {
            text: '禁用',
            value: 'false',
          },
        ],
      }),
    },
  ],
  transport: {
    read: {
      url: devopsOrganizationsApiConfig.getOrgPinelineTemplate().url,
      method: 'get',
    },
  },
});

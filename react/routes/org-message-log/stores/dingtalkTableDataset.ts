import { messageApiConfig } from '@choerodon/master';
import { DataSet } from 'choerodon-ui/pro';

const queryPredefined = new DataSet({
  autoQuery: true,
  paging: false,
  fields: [
    { name: 'key', type: 'string' as any },
    { name: 'value', type: 'string' as any },
  ],
  data: [
    { key: 'S', value: '成功' },
    { key: 'F', value: '失败' },
    { key: 'P', value: '就绪' },
  ],
});

export default ({ }): any => ({
  autoCreate: true,
  selection: false,
  fields: [
    {
      name: 'messageName',
      label: '消息主题',
    },
    {
      name: 'statusMeaning',
      label: '状态',
    },
    {
      name: 'failedReason',
      label: '失败原因',
    },
    {
      name: 'creationDate',
      label: '发送时间',
    },
  ],
  queryFields: [
    { name: 'messageName', type: 'string', label: '消息主题' },
    {
      name: 'status', type: 'string', label: '状态', textField: 'value', valueField: 'key', options: queryPredefined,
    },
  ],
  transport: {
    read: {
      url: messageApiConfig.getMsgList().url,
      method: 'get',
    },
  },
});

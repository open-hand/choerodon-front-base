import { messageApiConfig } from '@choerodon/master';

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
  transport: {
    read: {
      url: messageApiConfig.getMsgList().url,
      method: 'get',
    },
  },
});

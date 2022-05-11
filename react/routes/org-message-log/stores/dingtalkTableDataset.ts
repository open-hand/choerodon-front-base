// import { organizationsApiConfig } from '@choerodon/master';

export default ({ }): any => ({
  autoCreate: true,
  fields: [
    {
      name: 'a',
      label: '消息主题',
    },
    {
      name: 'b',
      label: '状态',
    },
    {
      name: 'c',
      label: '类型',
    },
    {
      name: 'd',
      label: '接收人',
    },
    {
      name: 'e',
      label: '发送内容',
    },
    {
      name: 'f',
      label: '失败原因',
    },
    {
      name: 'g',
      label: '发送时间',
    },
  ],
  transport: {
    read: {
      //   url: organizationsApiConfig.cooperationProjStatusList().url,
      url: 'http://172.23.16.154:30094/agile/v1/projects/282911590022897664/waterfall/deliverable/page_by_projectId',
      method: 'get',
    },
  },
});

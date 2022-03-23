// import { organizationsApiConfig } from '@choerodon/master';

export default ({ }): object => ({
  autoCreate: true,
  fields: [
    {
      name: 'a',
      label: '是否自动同步',
      type: 'boolean',
    },
    {
      name: 'b',
      label: '同步频率',
    },
    {
      name: 'c',
      label: '开始同步时间',
      type: 'date',
    },
  ],
  transport: {
    read: {
      //   url: organizationsApiConfig.cooperationProjStatusList().url,
      method: 'get',
    },
  },
});

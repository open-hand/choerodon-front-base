// import { organizationsApiConfig } from '@choerodon/master';

export default ({ }): object => ({
  autoCreate: true,
  autoQuery: true,
  selection: false,
  fields: [
    { name: 'syncBeginTime', type: 'string', label: '同步时间' },
    { name: 'updateUserCount', type: 'string', label: '成功人数' },
    { name: 'errorUserCount', type: 'string', label: '失败人数' },
    { name: 'syncEndTime', type: 'string', label: '耗时' },
  ],
  data: [
    {
      syncBeginTime: 1,
      updateUserCount: 2,
      errorUserCount: 3,
      syncEndTime: 4,
    },
  ],
  transport: {
    read: {
      //   url: organizationsApiConfig.cooperationProjStatusList().url,
      method: 'get',
    },
  },
});

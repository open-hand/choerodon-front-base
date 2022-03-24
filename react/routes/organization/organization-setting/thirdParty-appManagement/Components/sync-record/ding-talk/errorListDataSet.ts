// import { organizationsApiConfig } from '@choerodon/master';

export default ({ }): object => ({
  autoCreate: true,
  autoQuery: true,
  selection: false,
  fields: [
    { name: 'loginName', type: 'string', label: '登录名' },
    { name: 'email', type: 'string', label: '邮箱' },
    { name: 'name', type: 'string', label: '名称' },
    { name: 'phone', type: 'string', label: '手机' },
    { name: 'cause', type: 'string', label: '失败原因' },
  ],
  transport: {
    read: {
      //   url: organizationsApiConfig.cooperationProjStatusList().url,
      method: 'get',
    },
  },
});

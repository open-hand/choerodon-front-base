// import { organizationsApiConfig } from '@choerodon/master';

export default ({ }): object => ({
  autoCreate: true,
  fields: [
    {
      name: 'a',
      label: 'AppID',
    },
    {
      name: 'b',
      label: 'AppSecret',
    },
    {
      name: 'c',
      label: '登录名',
    },
    {
      name: 'd',
      label: '邮箱',
    },
    {
      name: 'e',
      label: '名称',
    },
    {
      name: 'f',
      label: '电话',
    },
  ],
  data: [
    {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
    },
  ],
  transport: {
    read: {
      //   url: organizationsApiConfig.cooperationProjStatusList().url,
      method: 'get',
    },
  },
});

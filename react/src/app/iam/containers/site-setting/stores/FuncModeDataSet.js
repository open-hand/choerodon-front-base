const mapping = {
  isInstallMission: {
    name: 'isInstallMission',
    type: 'string',
    label: '是否安装任务管理模块服务',
    defaultValue: '-',
  },
  isInstallDevops: {
    name: 'isInstallDevops',
    type: 'string',
    label: '是否安装DevOps管理模块服务',
    defaultValue: '-',
  },
  isInstallTest: {
    name: 'isInstallTest',
    type: 'string',
    label: '是否安装测试管理模块服务',
    defaultValue: '-',
  },
};

export { mapping };

export default () => ({
  autoCreate: true,
  // autoQuery: true,
  // transport: {
  //   read: {
  //     url: '/devops/v1/users/sync_records',
  //     method: 'get',
  //   },
  // },
  fields: Object.keys(mapping).map((key) => {
    const item = mapping[key];
    return item;
  }),
});

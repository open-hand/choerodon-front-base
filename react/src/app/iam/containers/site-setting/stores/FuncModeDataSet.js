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
  autoQuery: true,
  transport: {
    read: {
      url: '/hadm/choerodon/v1/services/model',
      method: 'get',
      transformResponse: (data) => {
        let newRes = data;
        try {
          newRes = JSON.parse(newRes);
          return [{
            [mapping.isInstallMission.name]: newRes.includes('agile') ? '是' : '否',
            [mapping.isInstallDevops.name]: newRes.includes('devops') ? '是' : '否',
            [mapping.isInstallTest.name]: newRes.includes('test') ? '是' : '否',
          }];
        } catch (e) {
          return [{
            [mapping.isInstallMission.name]: newRes.includes('agile') ? '是' : '否',
            [mapping.isInstallDevops.name]: newRes.includes('devops') ? '是' : '否',
            [mapping.isInstallTest.name]: newRes.includes('test') ? '是' : '否',
          }];
        }
      },
    },
  },
  fields: Object.keys(mapping).map((key) => {
    const item = mapping[key];
    return item;
  }),
});

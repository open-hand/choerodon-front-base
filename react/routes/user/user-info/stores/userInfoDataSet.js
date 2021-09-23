const testDsConfig = () => ({
  autoCreate: true,
  autoQuery: true,
  fields: [
    {
      name: 'email',
      type: 'string',
      label: '邮箱地址',
    },
    {
      name: 'phone',
      type: 'string',
      label: '手机号码',
      pattern: /^1[3-9]\d{9}$/,
    },
    {
      name: 'password',
      type: 'string',
      label: '密码',
      defaultValue: '***********',
      ignore: 'always',
    },
    {
      name: 'language',
      type: 'string',
      label: '语言',
    },
    {
      name: 'timeZone',
      type: 'string',
      label: '时区',
    },
    {
      name: 'organizationName',
      type: 'string',
      label: '组织名称',
    },
    {
      name: 'organizationCode',
      type: 'string',
      label: '组织编码',
    },
  ],
  transport: {
    read: ({ data, params, dataSet }) => ({
      url: '/iam/choerodon/v1/users/personal',
      method: 'get',
    }),
    update: ({ data, params, dataSet }) => ({
      url: `/iam/choerodon/v1/users/${data[0].id}/info`,
      method: 'put',
      data: JSON.stringify(data[0]),
    }),
  },
  events: {
    // update: ({
    //   dataSet, record, name, value, oldValue,
    // }) => {
    //   console.log(787878);
    // },
    // submit: ({ dataSet, data }) => {
    //   console.log('submit');
    // },
  },
});
export default testDsConfig;

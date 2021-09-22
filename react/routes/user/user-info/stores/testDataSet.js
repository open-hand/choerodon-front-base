const testDsConfig = () => ({
  autoCreate: true,
  autoQuery: true,
  fields: [
    {
      name: 'email',
      //   defaultValue: email,
      type: 'string',
      label: '邮箱地址',
    },
    {
      name: 'phone',
      //   defaultValue: phone,
      type: 'string',
      label: '手机号码',
    },
    {
      name: 'language',
      //   defaultValue: language,
      type: 'string',
      label: '语言',
    },
    {
      name: 'timeZone',
      //   defaultValue: timeZone,
      type: 'string',
      label: '时区',
    },
    {
      name: 'organizationName',
      //   defaultValue: organizationName,
      type: 'string',
      label: '组织名称',
    },
    {
      name: 'organizationCode',
      //   defaultValue: organizationCode,
      type: 'string',
      label: '组织编码',
    },
  ],
  transport: {
    read: ({ data, params, dataSet }) => {
      console.log(2222);
      return {
        url: '/iam/choerodon/v1/users/personal',
        method: 'get',
      };
    },
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

const userInfoDsConfig = (formatClient, formatCommon) => ({
  autoCreate: true,
  autoQuery: true,
  fields: [
    {
      name: 'email',
      type: 'string',
      label: formatClient({ id: 'email' }),
      // eslint-disable-next-line no-useless-escape
      // pattern: /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/,
    },
    {
      name: 'phone',
      type: 'string',
      label: formatClient({ id: 'phone' }),
    },
    {
      name: 'password',
      type: 'string',
      label: formatCommon({ id: 'password' }),
      defaultValue: '***********',
      ignore: 'always',
    },
    {
      name: 'language',
      type: 'string',
      label: formatCommon({ id: 'language' }),
    },
    {
      name: 'timeZone',
      type: 'string',
      label: formatClient({ id: 'timezone' }),
    },
    {
      name: 'organizationName',
      type: 'string',
      label: formatClient({ id: 'organizationName' }),
    },
    {
      name: 'organizationCode',
      type: 'string',
      label: formatClient({ id: 'organizationCode' }),
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
});
export default userInfoDsConfig;

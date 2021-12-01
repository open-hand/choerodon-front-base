// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  id = 0, organizationId, formatCommon,
}) => {
  const username = formatCommon({ id: 'username' });

  return {
    autoQuery: false,
    autoCreate: false,
    selection: false,
    fields: [
      {
        name: 'userName', label: username, textField: 'realName', valueField: 'id', required: true,
      },
    ],
    transport: {
      create: ({ data, dataSet }) => ({
        url: `/iam/choerodon/v1/organizations/${organizationId}/org_administrator`,
        method: 'post',
        data: undefined,
        params: {
          id: data[0].userName.join(','),
        },
      }),
    },
  };
};

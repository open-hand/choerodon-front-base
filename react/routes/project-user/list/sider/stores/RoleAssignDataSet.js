export default ({ id = 0, intl }) => ({
  selection: false,
  transport: {
    create: ({ data: [data] }) => ({
      url: `/iam/choerodon/v1/projects/${id}/users/assign_roles`,
      method: 'post',
      transformRequest: (() => {
        const rawData = data.memberId.map((v, index) => ({
          memberId: v,
          roleIds: data.roleIds[index],
        }));
        return JSON.stringify(rawData);
      }),
    }),
  },
  fields: [
    {
      name: 'memberId', label: '用户', textField: 'realName', valueField: 'id', required: true,
    },
    {
      name: 'roleIds', label: '角色', textField: 'name', valueField: 'id', required: true,
    },
  ],
});

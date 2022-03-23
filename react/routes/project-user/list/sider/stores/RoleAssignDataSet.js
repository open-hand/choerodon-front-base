export default ({ id = 0, intl }) => ({
  selection: false,
  transport: {
    create: ({ data: [data] }) => ({
      url: `/iam/choerodon/v1/projects/${id}/users/assign_roles`,
      method: 'post',
      transformRequest: (() => {
        const rawData = data.memberId.map((v, index) => ({
          memberId: v,
          roleId: data.roleId[index],
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
      name: 'roleId', label: '角色', textField: 'name', valueField: 'id', required: true,
    },
    { name: 'scheduleEntryTime', label: '计划进场时间' },
    { name: 'scheduleExitTime', label: '计划撤场时间' },
    { name: 'outsourcing', label: '是否外包' },
    { name: 'workingGroup', label: '所属工作组' },
  ],
});

export default (roleChildrenDataSet) => ({
  autoQuery: false,
  paging: false,
  autoCreate: true,
  fields: [
    {
      name: 'roleIds', label: '角色', textField: 'name', valueField: 'id', required: true,
    },
  ],
  children: {
    users: roleChildrenDataSet,
  },
});

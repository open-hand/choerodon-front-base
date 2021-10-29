export default ({ id = 0, intl, orgRoleDataSet }) => {
  const username = intl.formatMessage({ id: 'username' });
  const loginName = intl.formatMessage({ id: 'loginname' });
  return {
    selection: false,
    fields: [
      {
        name: 'roles', required: true, type: 'string', label: '角色', textField: 'name', valueField: 'id',
      },
    ],
  };
};

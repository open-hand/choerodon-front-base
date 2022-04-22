export default () => ({
  autoQuery: false,
  autoCreate: true,
  fields: [
    {
      name: 'role',
      label: '角色',
      textField: 'name',
      valueField: 'id',
      required: true,
    },
  ],
});

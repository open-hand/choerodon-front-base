export default ({
  formatCommon,
}) => ({
  selection: false,
  fields: [
    {
      name: 'roles', type: 'string', label: formatCommon({ id: 'role' }), textField: 'name', valueField: 'id',
    },
  ],
});

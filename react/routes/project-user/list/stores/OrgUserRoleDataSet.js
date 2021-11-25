export default ({ formatCommon }) => ({
  selection: false,
  fields: [
    {
      name: 'roles', required: true, type: 'string', label: formatCommon({ id: 'role' }), textField: 'name', valueField: 'id',
    },
  ],
});

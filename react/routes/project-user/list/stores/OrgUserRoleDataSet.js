export default ({ formatCommon }) => ({
  selection: false,
  fields: [
    {
      name: 'roles', required: true, label: formatCommon({ id: 'role' }), textField: 'name', valueField: 'id',
    },
  ],
});

export default ({ id = 0 }) => ({
  autoQuery: true,
  selection: 'single',
  paging: false,
  transport: {
    read: {
      url: `/iam/choerodon/v1/organizations/${id}/roles?role_name=`,
      method: 'get',
      dataKey: null,
    },
  },
  fields: [
    { name: 'name', type: 'string' },
    { name: 'code', type: 'string' },
    { name: 'id', type: 'string', unique: true },
  ],
});

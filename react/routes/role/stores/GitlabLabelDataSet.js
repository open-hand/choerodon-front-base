export default () => ({
  autoQuery: false,
  selection: 'single',
  paging: false,
  transport: {
    read: {
      url: '/iam/choerodon/v1/labels?type=role&level=project&gitlabLabel=true',
      method: 'get',
    },
  },
  fields: [
    { name: 'name', type: 'string' },
    { name: 'id', type: 'string', unique: true },
  ],
});

export default () => ({
  autoQuery: false,
  paging: false,
  selection: false,
  fields: [
    { name: 'code', type: 'string', label: '权限' },
    { name: 'description', type: 'string', label: '描述' },
  ],
});

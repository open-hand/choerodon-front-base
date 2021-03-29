export default () => ({
  autoQuery: false,
  selection: false,
  paging: false,
  idField: 'id',
  parentField: 'parentId',
  checkField: 'isChecked',
  expandField: 'expand',
  fields: [
    { name: 'isChecked', type: 'boolean' },
    { name: 'name', type: 'string', label: '名称' },
    { name: 'route', type: 'string', label: '页面入口' },
  ],
});

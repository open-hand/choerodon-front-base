const mapping = {
  appTemplate: {
    name: 'appTemplate',
    type: 'string',
    label: '应用模板',
  },
  temCode: {
    name: 'temCode',
    type: 'string',
    label: '模板编码',
  },
  repo: {
    name: 'repo',
    type: 'string',
    label: '仓库地址',
  },
  source: {
    name: 'source',
    type: 'string',
    label: '来源',
  },
  createTime: {
    name: 'createTime',
    type: 'string',
    label: '创建时间',
  },
  status: {
    name: 'status',
    type: 'string',
    label: '状态',
  },
};

export { mapping };

export default () => ({
  selection: false,
  autoCreate: true,
  paging: true,
  fields: Object.keys(mapping).map((key) => mapping[key]),
});

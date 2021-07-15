const wayOptions = [{
  value: 'normal',
  text: '普通添加',
}, {
  value: 'role',
  text: '基于角色添加',
}];

const mapping = {
  way: {
    name: 'way',
    label: '添加方式',
    type: 'string',
    defaultValue: wayOptions[0].value,
  },
};

const dataset = () => ({
  autoCreate: true,
  fields: Object.keys(mapping).map((i) => mapping[i]),
});

export default dataset;

export { mapping, wayOptions };

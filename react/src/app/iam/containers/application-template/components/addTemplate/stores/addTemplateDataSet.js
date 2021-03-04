import { DataSet } from 'choerodon-ui/pro';

const codeValidator = (value, name, record) => {
  if (!/^[a-zA-Z][a-zA-Z0-9-_.]*$/.test(value)) {
    return '编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾';
  }
  return true;
};

const mapping = {
  templateName: {
    name: 'templateName',
    type: 'string',
    label: '模板名称',
    required: true,
    maxLength: 40,
  },
  templateCode: {
    name: 'templateCode',
    type: 'string',
    label: '模板编码',
    required: true,
    maxLength: 30,
    validator: codeValidator,
  },
  createWay: {
    name: 'createWay',
    type: 'string',
    label: '创建方式',
    textField: 'text',
    valueField: 'value',
    defaultValue: 'exist',
    options: new DataSet({
      data: [{
        value: 'exist',
        text: '基于已有模板创建',
      }, {
        value: 'gitlab',
        text: '从GitLab导入模板',
      }, {
        value: 'github',
        text: '从Github导入模板',
      }],
    }),
  },
  appTemplate: {
    name: 'appTemplate',
    type: 'string',
    label: '应用模板',
  },
  gitlabAddress: {
    name: 'gitlabAddress',
    type: 'string',
    label: 'GitLab地址',
    required: true,
  },
  token: {
    name: 'token',
    type: 'string',
    label: '私有Token',
    required: true,
  },
  githubAddress: {
    name: 'githubAddress',
    type: 'string',
    label: 'GitHub地址',
    required: true,
  },
};

export { mapping };

export default () => ({
  autoCreate: true,
  fields: Object.keys(mapping).map((key) => {
    const item = mapping[key];
    switch (key) {
      // 应用模板
      case 'appTemplate':
        item.dynamicProps = {
          required: ({ record }) => record.get(mapping.createWay.name) === 'exist',
        };
        break;
      //  gitlab地址
      case 'gitlabAddress':
        item.dynamicProps = {
          required: ({ record }) => record.get(mapping.createWay.name) === 'gitlab',
        };
        break;
      //  私有Token
      case 'token':
        item.dynamicProps = {
          required: ({ record }) => record.get(mapping.createWay.name) === 'gitlab',
        };
        break;
      case 'githubAddress':
        item.dynamicProps = {
          required: ({ record }) => record.get(mapping.createWay.name) === 'github',
        };
        break;
      default:
        break;
    }
    return item;
  }),
});

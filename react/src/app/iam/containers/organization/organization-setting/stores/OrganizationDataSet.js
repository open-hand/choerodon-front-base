import pick from 'lodash/pick';

function validateName(value, name, record) {
  const patternHTMLEmpty = /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/;
  if (!value || !patternHTMLEmpty.test(value)) {
    return '组织名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成';
  }
  return true;
}

export default ({ id = 0 }) => ({
  // autoCreate: true,
  autoQuery: true,
  transport: {
    read: {
      url: `/iam/choerodon/v1/organizations/${id}/org_level`,
      method: 'get',
      transformResponse: ((data, headers) => {
        const newData = JSON.parse(data);
        newData.tenantConfigVO = {
          ...newData,
          ...newData.tenantConfigVO,
          name: newData.tenantName,
          code: newData.tenantNum,
        };
        return ({
          list: [newData.tenantConfigVO],
        });
      }),
    },
    update: ({ data: [data] }) => {
      const postData = pick(data, ['tenantName', 'tenantNum', 'objectVersionNumber', 'enabledFlag']);
      postData.tenantConfigVO = {
        homePage: data.homePage || '',
        address: data.address || '',
        imageUrl: data.imageUrl || '',
      };
      return ({
        url: `/iam/choerodon/v1/organizations/${id}/organization_level`,
        method: 'put',
        data: postData,
      });
    },
  },
  fields: [
    { name: 'imageUrl', type: 'string', label: '组织Logo' },
    {
      name: 'tenantName', type: 'string', label: '组织名称', defaultValue: '汉得', required: true, validator: validateName,
    },
    {
      name: 'tenantNum', type: 'string', label: '组织编码', required: true,
    },
    { name: 'address', type: 'string', label: '组织所在地' },
    {
      name: 'homePage', type: 'url', label: '官网地址', defaultValue: '无',
    },
    { name: 'ownerRealName', type: 'string', label: '所有者' },
  ],
});

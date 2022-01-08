import pick from 'lodash/pick';

function validateName(value, name, record) {
  const patternHTMLEmpty = /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/;
  if (!value || !patternHTMLEmpty.test(value)) {
    return '组织名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成';
  }
  return true;
}

export default ({ id = 0, formatClient }) => ({
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
          tableSplitFlag: newData.tableSplitFlag,
        };
        return ({
          list: [newData.tenantConfigVO],
        });
      }),
    },
    update: ({ data: [data] }) => {
      const postData = pick(data, ['tenantName', 'tenantNum', 'objectVersionNumber',
        'enabledFlag', 'tableSplitFlag']);
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
    { name: 'imageUrl', type: 'string', label: formatClient({ id: 'base.logo' }) },
    {
      name: 'tenantName', type: 'string', label: formatClient({ id: 'base.organizationName' }), defaultValue: '汉得', required: true, validator: validateName,
    },
    {
      name: 'tenantNum', type: 'string', label: formatClient({ id: 'base.organizationCode' }), required: true,
    },
    { name: 'address', type: 'string', label: formatClient({ id: 'base.locationOfOrganization' }) },
    {
      name: 'homePage', type: 'url', label: formatClient({ id: 'base.website' }), defaultValue: '无',
    },
    { name: 'ownerRealName', type: 'string', label: formatClient({ id: 'base.organizationOwner' }) },
  ],
});

export default ({
  id = 0, intlPrefix, format, formatCommon,
}) => {
  const checkMinLength = (value, name, record) => {
    if (value > record.get('maxPasswordLength')) {
      return '最小密码长度必须小于最大密码长度';
    }
    return true;
  };
  const checkMaxLength = (value, name, record) => {
    if (value < record.get('minPasswordLength')) {
      return '最大密码长度必须大于最小密码长度';
    }
    return true;
  };
  return {
    // autoCreate: true,
    autoQuery: true,
    transport: {
      read: {
        url: '/iam/choerodon/v1/system/setting',
        method: 'get',
        dataKey: null,
        transformResponse: (data) => {
          const parseData = JSON.parse(data);
          const {
            defaultPassword, minPasswordLength, maxPasswordLength,
          } = parseData;
          const dft = {
            defaultPassword: defaultPassword || 'abcd1234',
            minPasswordLength: minPasswordLength || 6,
            maxPasswordLength: maxPasswordLength || 18,
            // forceModifyPassword: forceModifyPassword !== false,
          };
          if (!defaultPassword && !minPasswordLength && !maxPasswordLength) {
            return ({ new: true, ...dft });
          }
          return ({
            ...parseData,
            ...dft,
          });
        },
      },
      update: ({ data }) => ({
        url: '/iam/choerodon/v1/system/setting/passwordPolicy',
        method: 'post',
        data: data[0],
      }),
    },
    fields: [
      {
        name: 'defaultPassword', type: 'string', label: '平台默认密码', required: true,
      },
      {
        name: 'minPasswordLength', type: 'number', min: 0, validator: checkMinLength, label: format({ id: 'minPassword' }), required: true,
      },
      {
        name: 'maxPasswordLength', type: 'number', min: 0, max: 65535, validator: checkMaxLength, label: format({ id: 'maxPassword' }), required: true,
      },
      // {
      //   name: 'forceModifyPassword', type: 'boolean', label: '登录时强制修改默认密码', defaultValue: true,
      // },
    ],
  };
};

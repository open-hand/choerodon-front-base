import { DataSet } from 'choerodon-ui/pro';
import { axios } from '@choerodon/boot';

export default function passwordPoliciesDataSet(organizationId, formatCommon, formatProjectUser) {
  async function handleLoad({ dataSet }) {
    if (dataSet.current && !dataSet.current.get('code')) {
      const orgData = {};
      try {
        const res = await axios.get(`/iam/choerodon/v1/organizations/${organizationId}/org_level`);
        orgData.code = res.tenantNum;
        orgData.name = res.tenantName;
      } catch (e) {
        //
      }
      dataSet.loadData([{
        ...orgData,
        digitsCount: 0,
        enableCaptcha: false,
        enableLock: false,
        enablePassword: false,
        enableSecurity: false,
        forceModifyPassword: true,
        lockedExpireTime: 0,
        lowercaseCount: 0,
        maxCheckCaptcha: 0,
        maxErrorTime: 0,
        maxLength: 0,
        minLength: 0,
        notRecentCount: 0,
        notUsername: false,
        originalPassword: null,
        regularExpression: null,
        specialCharCount: 0,
        uppercaseCount: 0,
      }]);
    }
  }

  function getAllCount(record) {
    const digitsCount = record.get('digitsCount');
    const specialCharCount = record.get('specialCharCount');
    const lowercaseCount = record.get('lowercaseCount');
    const uppercaseCount = record.get('uppercaseCount');

    return digitsCount + specialCharCount + lowercaseCount + uppercaseCount;
  }
  // eslint-disable-next-line consistent-return
  function checkMinLength(value, name, record) {
    if (value > record.get('maxLength')) {
      return formatProjectUser({ id: 'min.lessthan.more' });
    }
  }
  // eslint-disable-next-line consistent-return
  function checkMaxLength(value, name, record) {
    if (getAllCount(record) > value) {
      return formatProjectUser({ id: 'max.length' });
    }
  }
  const fields = [
    { name: 'enablePassword', type: 'boolean', label: '是否启用' },
    { name: 'notUsername', type: 'boolean', label: '是否允许密码与登录名相同' },
    { name: 'originalPassword', type: 'string', label: '新用户默认密码' },
    {
      name: 'minLength', type: 'number', step: 1, min: 0, max: 65535, label: '最小密码长度', validator: checkMinLength, defaultValue: 0,
    },
    {
      name: 'maxLength', type: 'number', step: 1, min: 0, max: 65535, label: '最大密码长度', validator: checkMaxLength, defaultValue: 0,
    },

    {
      name: 'digitsCount', type: 'number', step: 1, min: 0, max: 65535, label: '最少数字数', defaultValue: 0,
    },
    {
      name: 'specialCharCount', type: 'number', step: 1, min: 0, max: 65535, label: '最少特殊字符', defaultValue: 0,
    },
    {
      name: 'lowercaseCount', type: 'number', step: 1, min: 0, max: 65535, label: '最少小写字母数', defaultValue: 0,
    },
    {
      name: 'uppercaseCount', type: 'number', step: 1, min: 0, max: 65535, label: '最少大写字母数', defaultValue: 0,
    },

    {
      name: 'notRecentCount', type: 'number', step: 1, min: 0, max: 65535, label: '最大近期密码', defaultValue: 0,
    },
    { name: 'regularExpression', type: 'string', label: '密码正则' },
    { name: 'enableSecurity', type: 'boolean', label: '是否启用' },
    { name: 'enableCaptcha', type: 'boolean', label: '是否开启验证码' },
    {
      name: 'maxCheckCaptcha', type: 'number', step: 1, min: 0, max: 65535, label: '验证码错误次数', defaultValue: 0,
    },
    { name: 'enableLock', type: 'boolean', label: '是否开启锁定' },
    {
      name: 'maxErrorTime', type: 'number', step: 1, min: 0, max: 65535, label: '最大密码错误次数', defaultValue: 0,
    },
    {
      name: 'lockedExpireTime', type: 'number', min: 0, label: '锁定时长', defaultValue: 0,
    },
    {
      name: 'forceModifyPassword', type: 'boolean', label: '登录时强制修改默认密码', defaultValue: true,
    },
    {
      name: 'enableRandomPassword',
      type: 'boolean',
      // 不设置 lable，防止覆盖 FormItem 定义的 label
      // label: '是否开启随机密码',
      defaultValue: false,
      options: new DataSet({
        data: [
          { value: true, meaning: '是' },
          { value: false, meaning: '否' },
        ],
      }),
    },
    {
      name: 'forceCodeVerify',
      type: 'boolean',
      // 不设置 lable，防止覆盖 FormItem 定义的 label
      // label: '强制校验码校验',
      defaultValue: false,
      options: new DataSet({
        data: [
          { value: true, meaning: '是' },
          { value: false, meaning: '否' },
        ],
      }),
    },
    {
      name: 'passwordUpdateRate', type: 'number', label: '密码更新频率',
    },
    {
      name: 'passwordReminderPeriod', type: 'number', label: '密码到期提醒',
    },
    {
      name: 'enableWebMultipleLogin',
      type: 'boolean',
      label: 'PC端允许多处登录',
      defaultValue: false,
      options: new DataSet({
        data: [
          { value: true, meaning: '是' },
          { value: false, meaning: '否' },
        ],
      }),
    },
    {
      name: 'enableAppMultipleLogin',
      type: 'boolean',
      label: '移动端允许多处登录',
      defaultValue: false,
      options: new DataSet({
        data: [
          { value: true, meaning: '是' },
          { value: false, meaning: '否' },
        ],
      }),
    },
    {
      name: 'loginAgain',
      type: 'boolean',
      label: '修改密码后重新登录',
      defaultValue: false,
      options: new DataSet({
        data: [
          { value: true, meaning: '是' },
          { value: false, meaning: '否' },
        ],
      }),
    },
    {
      name: 'userLoginSecondCheck',
      label: '',
    },
  ];

  return {
    autoQuery: true,
    dataKey: null,
    paging: false,
    transport: {
      read: {
        url: `/iam/v1/${organizationId}/password-policies`,
        method: 'get',
      },
      submit: (record) => ({
        url: `/iam/v1/${organizationId}/password-policies`,
        method: 'put',
        transformRequest: (([data]) => {
          Object.keys(data).forEach((key) => {
            const field = fields.find((v) => v.name === key);
            if ((data[key] === null || data[key] === undefined) && field && field.type === 'number') {
              // eslint-disable-next-line no-param-reassign
              data[key] = 0;
            }
          });
          fields.forEach((v) => {
            if (v.type === 'number' && data[v.name] === undefined) {
              // eslint-disable-next-line no-param-reassign
              data[v.name] = 0;
            } else if ((data[v.name] === undefined || data[v.name] === null) && v.name !== 'regularExpression') {
              // eslint-disable-next-line no-param-reassign
              data[v.name] = '';
            }
          });
          return JSON.stringify(data);
        }),
      }),
    },
    fields,
    events: {
      load: handleLoad,
    },
  };
}

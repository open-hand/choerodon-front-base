/* eslint-disable no-param-reassign */
import { axios } from '@choerodon/boot';

export default ({
  id = 0, formatCommon, formatProjectUser, userStore,
}) => {
  const username = formatCommon({ id: 'username' });
  const emailReg = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
  async function checkEmail(email) {
    try {
      const suffix = userStore.getEmailSuffix || '';
      if (!emailReg.test(`${email}${suffix}`)) {
        return '请输入正确的邮箱地址';
      }
      const result = await axios.post(
        `/iam/choerodon/v1/organizations/${id}/users/check`,
        JSON.stringify({ organizationId: id, email: `${email}${suffix}` }),
      );
      if (result.failed && !result) {
        return '用户邮箱已存在';
      }
    } catch (e) {
      // Choerodon.prompt(e.message);
      if (e && e.message) {
        return e.message;
      }
      return '邮箱校验失败，请稍后再试';
    }
    return true;
  }
  return {
    selection: false,
    transport: {
      create: {
        url: `/iam/choerodon/v1/organizations/${id}/users`,
        method: 'post',
        transformRequest: ([data]) => {
          data.roles = data.roles.map((v) => ({ id: v }));
          data.email = `${data.email}${userStore.getEmailSuffix || ''}`;
          return JSON.stringify(data);
        },
      },
    },
    fields: [
      {
        name: 'realName',
        type: 'string',
        label: username,
        required: true,
      },
      {
        name: 'roles',
        label: formatCommon({ id: 'role' }),
        textField: 'name',
        valueField: 'id',
      },
      {
        name: 'email',
        type: 'string',
        label: formatCommon({ id: 'email' }),
        required: true,
        validator: checkEmail,
      },
      { name: 'password', type: 'string', label: formatCommon({ id: 'password' }) },
      {
        name: 'outsourcing', type: 'boolean', label: '是否外包', defaultValue: false,
      },
    ],
  };
};

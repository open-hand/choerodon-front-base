import { axios, Choerodon } from '@choerodon/boot';

export default ({ id = 0, formatCommon }) => {
  const username = formatCommon({ id: 'username' });
  // eslint-disable-next-line consistent-return
  async function checkEmail(email) {
    try {
      const result = await axios.post(`/iam/choerodon/v1/projects/${id}/users/check`, JSON.stringify({ projectId: id, email }));
      if (result.failed) {
        return result.message;
      }
    } catch (e) {
      Choerodon.prompt(e);
    }
  }
  return {
    selection: false,
    transport: {
      create: {
        url: `/iam/choerodon/v1/projects/${id}/users`,
        method: 'post',
        transformRequest: (([data]) => {
          // eslint-disable-next-line no-param-reassign
          data.roles = data.roles.map((v) => ({ id: v }));
          return JSON.stringify(data);
        }),
      },
    },
    fields: [
      {
        name: 'realName', type: 'string', label: username, required: true,
      },
      {
        name: 'roles', type: 'string', label: formatCommon({ id: 'role' }), textField: 'name', valueField: 'id', required: true,
      },
      {
        name: 'email', type: 'email', label: formatCommon({ id: 'email' }), required: true, validator: checkEmail,
      },
      {
        name: 'password', type: 'string', label: formatCommon({ id: 'password' }), required: true,
      },
    ],
  };
};

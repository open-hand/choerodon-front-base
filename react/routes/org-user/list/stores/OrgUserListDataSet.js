/* eslint-disable import/no-anonymous-default-export */
import { axios } from '@choerodon/boot';
import { DataSet } from 'choerodon-ui/pro';

const regPhone = new RegExp(/^1[3-9]\d{9}$/);
const emptyReg = new RegExp(/^\s*$/);

export default ({
  id = 0, formatCommon, formatProjectUser, safeOptionDs, statusOptionDs, orgRoleDataSet,
  orgID,
}) => {
  const username = formatCommon({ id: 'username' });
  const loginName = formatCommon({ id: 'account' });
  const status = formatCommon({ id: 'states' });
  const safeStatus = formatProjectUser({ id: 'safe-status' });
  const source = formatProjectUser({ id: 'source' });
  async function check(value, name, record) {
    const organizationId = record.get('organizationId');
    if (value === record.getPristineValue(name) || !value) return;
    try {
      const result = await axios.post(`/iam/choerodon/v1/organizations/${organizationId}/users/check`, JSON.stringify({ organizationId, [name]: value }));
      if (result.failed) {
        // eslint-disable-next-line consistent-return
        return formatProjectUser({ id: result.message });
      }
    } catch (e) {
      // Choerodon.prompt(e);
      if (e && e.message) {
        // eslint-disable-next-line consistent-return
        return e.message;
      }
      // eslint-disable-next-line consistent-return
      return false;
    }
  }
  function checkPhone(value, name, record) {
    if (value === record.getPristineValue(name) || !value) return;
    if (!regPhone.test(value)) {
      // eslint-disable-next-line consistent-return
      return '手机号格式错误';
    }
    // eslint-disable-next-line consistent-return
    return check(value, name, record);
  }
  // eslint-disable-next-line consistent-return
  function checkRealname(value, name, record) {
    if (emptyReg.test(value)) {
      return '用户名不能全为空格';
    }
  }
  return {
    autoQuery: false,
    autoCreate: true,
    selection: false,
    transport: {
      read: {
        url: `/iam/choerodon/v1/organizations/${id}/users/search`,
        method: 'get',
      },
      create: {
        url: `/iam/choerodon/v1/organizations/${id}/users`,
        method: 'post',
        transformRequest: (([data]) => JSON.stringify(data)),
      },
      update: ({ data: editData }) => ({
        url: `/iam/choerodon/v1/organizations/${id}/users/${editData[0].id}`,
        method: 'put',
        transformRequest: (([data]) => JSON.stringify(data)),
      }),
    },
    fields: [
      {
        name: 'realName', type: 'string', label: username, required: true, validator: checkRealname,
      },
      {
        name: 'loginName', type: 'string', label: loginName, unique: true,
      },
      {
        name: 'enabled', type: 'boolean', label: status, textField: 'text', valueField: 'value', options: statusOptionDs,
      },
      {
        name: 'roles', type: 'object', label: formatCommon({ id: 'role' }), multiple: true, textField: 'name', valueField: 'id',
      },
      {
        name: 'locked', type: 'boolean', label: safeStatus, textField: 'text', valueField: 'value', options: safeOptionDs,
      },
      {
        name: 'email', type: 'email', label: '邮箱', validator: check, required: true,
      },
      { name: 'password', type: 'string', label: '密码' },
      {
        name: 'phone', type: 'string', label: '手机', validator: checkPhone,
      },
      {
        name: 'language', type: 'string', label: '语言', defaultValue: 'zh_CN',
      },
      {
        name: 'timeZone', type: 'string', label: '时区', defaultValue: 'CTT',
      },
      { name: 'myRoles', type: 'string', label: formatCommon({ id: 'role' }) },
      { name: 'ldap', type: 'boolean', label: source },
      {
        name: 'userLabels',
        label: '标签',
        textField: 'name',
        valueField: 'name',
        placeholder: '输入即可创建标签',
        options: new DataSet({
          selection: 'multiple',
          autoQuery: false,
          transport: {
            read: {
              url: `/iam/choerodon/v1/organizations/${orgID}/list_user_labels`,
              method: 'get',
              transformResponse: (data) => {
                const arr = JSON.parse(data);
                const newArr = [];
                arr.forEach((item) => {
                  const obj = {};
                  obj.name = item;
                  obj.status = 'remote';
                  newArr.push(obj);
                });
                return newArr;
              },
            },
          },
        }),
      },
    ],
    queryFields: [
      { name: 'realName', type: 'string', label: formatCommon({ id: 'username' }) },
      { name: 'loginName', type: 'string', label: formatCommon({ id: 'account' }) },
      {
        name: 'roleName', type: 'string', label: formatCommon({ id: 'role' }), textField: 'name', valueField: 'name', options: orgRoleDataSet,
      },
      {
        name: 'enabled', type: 'string', label: formatProjectUser({ id: 'enabled' }), textField: 'text', valueField: 'value', options: statusOptionDs,
      },
      {
        name: 'locked', type: 'string', label: formatProjectUser({ id: 'locked' }), textField: 'text', valueField: 'value', options: safeOptionDs,
      },
    ],
  };
};

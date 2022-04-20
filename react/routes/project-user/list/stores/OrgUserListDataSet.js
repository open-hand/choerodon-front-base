/* eslint-disable */
import { axios, Choerodon } from '@choerodon/boot';
import { DataSet } from 'choerodon-ui/pro';

const regPhone = new RegExp(/^1[3-9]\d{9}$/);
const emptyReg = new RegExp(/^\s*$/);

export default ({
  id = 0, formatProjectUser, formatCommon, safeOptionDs, statusOptionDs, orgRoleDataSet,organizationId
}) => {
  const username = formatCommon({ id: 'username' });
  const loginName = formatCommon({ id: 'account' });
  const status = formatCommon({ id: 'states' });
  const safeStatus = formatProjectUser({ id: 'safe-status' });
  async function check(value, name, record) {
    const projectId = record.get('projectId');
    if (value === record.getPristineValue(name) || !value) return;
    try {
      const result = await axios.post(`/iam/choerodon/v1/projects/${projectId}/users/check`, JSON.stringify({ projectId, [name]: value }));
      if (result.failed) {
        return formatProjectUser({ id: result.message });
      }
    } catch (e) {
      Choerodon.prompt(e);
    }
  }
  function checkPhone(value, name, record) {
    if (value === record.getPristineValue(name) || !value) return;
    if (!regPhone.test(value)) {
      return '手机号格式错误';
    }
    return check(value, name, record);
  }
  function checkRealname(value, name, record) {
    if (emptyReg.test(value)) {
      return '用户名不能全为空格';
    }
  }
  return {
    autoQuery: true,
    selection: 'multiple',
    pageSize: 15,
    primaryKey: 'id',
    cacheSelection: true,
    transport: {
      read: {
        url: `/iam/choerodon/v1/projects/${id}/users/search`,
        method: 'get',
        transformResponse(data) {
          const newData = JSON.parse(data);
          newData.list = newData.content;
          newData.list = newData.list.map((l) => {
            l.roles = l.roles.map((r) => {
              r.origin = true;
              return r;
            });
            return l;
          });
          return newData;
        },
      },
      create: {
        url: `/iam/choerodon/v1/projects/${id}/users`,
        method: 'post',
        transformRequest: (([data]) => JSON.stringify(data)),
      },
      update: ({ data: editData }) => ({
        url: `/iam/choerodon/v1/projects/${id}/users/${editData[0].id}`,
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
        name: 'roles', type: 'string', label: formatCommon({id:'role'}), multiple: true, textField: 'name', valueField: 'id',required:true
      },
      // 这里加个role 是为了列表模式的角色 如果列表模式的角色用roles renderer会渲染多次
      {
        name: 'role',
        type: 'string',
        label: formatCommon({id:'role'}),
      },
      {
        name: 'locked', type: 'boolean', label: safeStatus, textField: 'text', valueField: 'value', options: safeOptionDs,
      },
      {
        name: 'email', type: 'email', label: formatCommon({id:'email'}), validator: check, required: true,
      },
      { name: 'password', type: 'string', label: formatCommon({id:'password'}) },
      {
        name: 'phone', type: 'string', label: formatCommon({id:'mobilephone'}), validator: checkPhone, required: true,
      },
      {
        name: 'language', type: 'string', label: formatCommon({id:'language'}), defaultValue: 'zh_CN',
      },
      {
        name: 'timeZone', type: 'string', label: '时区', defaultValue: 'CTT',
      },
      { name: 'myRoles', type: 'string', label: formatCommon({id:'role'}) },
      {
        name: 'userLabels',
        label: '标签',
        textField: 'name',
        valueField: 'name',
        placeholder: '输入即可创建标签',
        options: new DataSet({
          selection: 'multiple',
          autoQuery: true,
          transport: {
            read: {
              url: `/iam/choerodon/v1/organizations/${organizationId}/list_user_labels`,
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
      { name: 'scheduleEntryTime', type: 'string', label: formatProjectUser({ id: 'scheduleEntryTime' }) },
      { name: 'scheduleExitTime', type: 'string', label: formatProjectUser({ id: 'scheduleExitTime' }) },
      { name: 'workingGroup', type: 'string', label: formatProjectUser({ id: 'workingGroup' }) },
    ],
    queryFields: [
      { name: 'realName', type: 'string', label: formatCommon({id:'username'}) },
      { name: 'loginName', type: 'string', label: formatCommon({id:'account'}) },
      {
        name: 'roleName', type: 'string', label: formatCommon({id:'role'}), textField: 'name', valueField: 'name', options: orgRoleDataSet,
      },
      {
        name: 'enabled', type: 'string', label: '启用状态', textField: 'text', valueField: 'value', options: statusOptionDs,
      },
    ],
    events: {
      load: ({ dataSet }) => {
        dataSet?.records.forEach(record => {
          record.selectable = !record.get('programOwner');
        })
      }
    }
  };
};

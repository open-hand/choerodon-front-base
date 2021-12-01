/* eslint-disable no-nested-ternary */
import { axios } from '@choerodon/boot';
import { DataSet } from 'choerodon-ui/pro';

const buildInDs = new DataSet({
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'key', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  data: [
    { key: 'true', value: '预定义' },
    { key: 'false', value: '自定义' },
  ],
});

const enabledDs = new DataSet({
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'key', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  data: [
    { key: 'true', value: '启用' },
    { key: 'false', value: '停用' },
  ],
});

const levelDs = new DataSet({
  autoQuery: false,
  selection: false,
  fields: [
    { name: 'key', type: 'string' },
    { name: 'value', type: 'string' },
  ],
  data: [
    { key: 'project', value: '项目层' },
    { key: 'organization', value: '组织层' },
  ],
});

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ level, organizationId, formatClient }) => {
  const codeValidator = async (value, name, record) => {
    const validValue = `role/${level}/custom/${value}`;
    if (record.status !== 'add') {
      return true;
    }
    if (!value) {
      return '编码必输。';
    }
    if (value.trim() === '') {
      return '编码不能全为空格。';
    }
    if (validValue.length > 64) {
      return '编码长度不能超过64！';
    }
    if (value.trim() === '') {
      return '编码不能全为空！';
    }
    const reg = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;
    if (!reg.test(value)) {
      return '编码只能由小写字母、数字、"-"组成，且以小写字母开头，不能以"-"结尾。';
    }
    if (record.status === 'add') {
      try {
        const params = { code: validValue };
        const res = await axios.post('/iam/choerodon/v1/roles/check', JSON.stringify(params));
        if (res.failed) {
          return '编码已存在。';
        }
        return true;
      } catch (err) {
        return '编码重名校验失败，请稍后再试。';
      }
    } else {
      return true;
    }
  };
  const nameValidator = async (value, name, record) => {
    if (!value) {
      return '编码必输。';
    }
    if (value.trim() === '') {
      return '编码不能全为空格。';
    }
    return true;
  };

  return {
    autoQuery: true,
    selection: false,
    transport: {
      read: ({ params, data }) => ({
        url: '/iam/choerodon/v1/roles/search',
        method: 'get',
        params: {
          ...params,
          sort: 'id,desc',
          tenantId: organizationId,
        },
        data: {
          ...data,
          builtIn: data.builtIn === 'true'
            ? true
            : data.builtIn === 'false'
              ? false
              : undefined,
          enabled: data.enabled === 'true'
            ? true
            : data.enabled === 'false'
              ? false
              : undefined,
        },
      }),
      destroy: ({ data: [data] }) => ({
        url: `/iam/choerodon/v1/organizations/${organizationId}/roles/${data.id}`,
        method: 'delete',
      }),
    },
    fields: [
      {
        name: 'name', type: 'string', label: formatClient({ id: 'name' }), required: true, validator: nameValidator,
      },
      {
        name: 'code', type: 'string', label: formatClient({ id: 'code' }), required: true, validator: codeValidator,
      },
      { name: 'roleLevel', type: 'string', label: formatClient({ id: 'level' }) },
      { name: 'builtIn', type: 'boolean', label: formatClient({ id: 'source' }) },
      { name: 'enabled', type: 'boolean', label: formatClient({ id: 'status' }) },
      {
        name: 'labels', type: 'auto', textField: 'name', valueField: 'id',
      },
    ],
    queryFields: [
      { name: 'name', type: 'string', label: formatClient({ id: 'name' }) },
      { name: 'code', type: 'string', label: formatClient({ id: 'code' }) },
      {
        name: 'roleLevel', type: 'string', label: formatClient({ id: 'level' }), textField: 'value', valueField: 'key', options: levelDs,
      },
      {
        name: 'builtIn', type: 'auto', label: formatClient({ id: 'source' }), textField: 'value', valueField: 'key', options: buildInDs,
      },
      {
        name: 'enabled', type: 'auto', label: formatClient({ id: 'status' }), textField: 'value', valueField: 'key', options: enabledDs,
      },
    ],
  };
};

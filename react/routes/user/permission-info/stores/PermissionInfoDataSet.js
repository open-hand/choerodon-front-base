import { DataSet } from 'choerodon-ui/pro/lib';

import JSONbig from 'json-bigint';

export default (userId, intl, intlPrefix, orgId) => {
  const name = intl.formatMessage({ id: `${intlPrefix}.name` });
  const code = intl.formatMessage({ id: `${intlPrefix}.code` });
  const level = intl.formatMessage({ id: 'level' });
  const role = intl.formatMessage({ id: 'role' });

  const queryPredefined = new DataSet({
    autoQuery: true,
    paging: false,
    fields: [
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    data: [
      { key: 'site', value: '平台' },
      { key: 'organization', value: '组织' },
      { key: 'project', value: '项目' },

    ],
  });
  const optionDataSet = new DataSet({
    selection: 'multiple',
    data: [
      { text: intl.formatMessage({ id: `${intlPrefix}.current` }), value: true },
    ],
  });

  return {
    autoQuery: true,
    selection: false,
    // dataKey: null,
    paging: true,
    fields: [
      { name: 'name', type: 'string', label: name },
      { name: 'code', type: 'string', label: code },
      { name: 'level', type: 'string', label: level },
      { name: 'roles', type: 'string', label: role },

    ],
    queryFields: [
      { name: 'name', type: 'string', label: name },
      // { name: 'code', type: 'string', label: code },
      { name: 'level', type: 'string', label: level, textField: 'value', valueField: 'key', options: queryPredefined },
      // { name: 'roles', type: 'string', label: role },
    ],

    transport: {
      read: () => ({
        url: `/iam/choerodon/v1/${orgId}/roles/self/roles`,
        method: 'get',
        transformResponse: (data) => ({
          list: JSONbig.parse(data).content,
          ...JSONbig.parse(data),
        }),
      }),
    },
  };
};

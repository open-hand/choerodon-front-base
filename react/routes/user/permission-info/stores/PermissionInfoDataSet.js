import { DataSet } from 'choerodon-ui/pro/lib';

import JSONbig from 'json-bigint';

// eslint-disable-next-line import/no-anonymous-default-export
export default (formatClient, formatCommon, orgId) => {
  const queryPredefined = new DataSet({
    autoQuery: true,
    paging: false,
    fields: [
      { name: 'key', type: 'string' },
      { name: 'value', type: 'string' },
    ],
    data: [
      { key: 'site', value: formatClient({ id: 'platformText' }) },
      { key: 'organization', value: formatClient({ id: 'organization' }) },
      { key: 'project', value: formatCommon({ id: 'project' }) },
    ],
  });

  return {
    autoQuery: true,
    selection: false,
    // dataKey: null,
    paging: true,
    fields: [
      { name: 'name', type: 'string', label: formatCommon({ id: 'name' }) },
      { name: 'code', type: 'string', label: formatCommon({ id: 'code' }) },
      { name: 'level', type: 'string', label: formatClient({ id: 'level' }) },
      { name: 'roles', type: 'string', label: formatCommon({ id: 'role' }) },

    ],
    queryFields: [
      { name: 'name', type: 'string', label: formatCommon({ id: 'name' }) },
      {
        name: 'level', type: 'string', label: formatClient({ id: 'level' }), textField: 'value', valueField: 'key', options: queryPredefined,
      },
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

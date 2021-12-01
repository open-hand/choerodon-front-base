// eslint-disable-next-line import/no-anonymous-default-export
export default ({
  id = 0, formatClient, formatCommon,
}) => {
  const username = formatCommon({ id: 'username' });
  const loginName = formatCommon({ id: 'account' });
  const status = '';
  const safeStatus = '';
  return {
    autoQuery: true,
    selection: false,
    transport: {
      read: {
        url: `/iam/choerodon/v1/organizations/${id}/org_administrator`,
        method: 'get',
      },
    },
    fields: [
      { name: 'userName', type: 'string', label: username },
      { name: 'loginName', type: 'string', label: loginName },
      { name: 'enabled', type: 'boolean', label: status },
      { name: 'locked', type: 'boolean', label: safeStatus },
      { name: 'creationDate', type: 'date', label: formatClient({ id: 'creationTime' }) },
    ],
    queryFields: [
      { name: 'realName', type: 'string', label: username },
      { name: 'loginName', type: 'string', label: loginName },
    ],
  };
};

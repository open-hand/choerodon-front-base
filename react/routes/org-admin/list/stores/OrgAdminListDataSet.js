
export default ({ id = 0, intl, intlPrefix }) => {
  const username = intl.formatMessage({ id: 'username' });
  const loginName = intl.formatMessage({ id: 'loginname' });
  const status = intl.formatMessage({ id: `${intlPrefix}.status` });
  const safeStatus = intl.formatMessage({ id: `${intlPrefix}.safe-status` });
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
      { name: 'creationDate', type: 'date', label: '添加日期' },
    ],
    queryFields: [
      { name: 'realName', type: 'string', label: username },
      { name: 'loginName', type: 'string', label: loginName },
    ],
  };
};

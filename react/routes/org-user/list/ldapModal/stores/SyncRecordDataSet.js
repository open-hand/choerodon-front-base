export default ({ orgId, ldapId }) => ({
  autoQuery: false,
  dataKey: null,
  paging: false,
  transport: {
    read: {
      url: `/iam/v1/${orgId}/ldaps/${ldapId}/latest-history`,
      method: 'get',
    },
  },
  fields: [
    { name: 'newUserCount', label: '同步用户的数量', type: 'number', defaultValue: 0 },
    { name: 'errorUserCount', label: '同步用户失败的数量', type: 'number', defaultValue: 0 },
    { name: 'syncBeginTime', label: '上次同步的时间', type: 'string' },
    { name: 'syncEndTime', label: '同步结束时间', type: 'string' },
    { name: 'ldapId', label: '同步id', type: 'string' },
  ],
});

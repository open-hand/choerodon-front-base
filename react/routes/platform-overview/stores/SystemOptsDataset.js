
export default () => ({
  autoQuery: false,
  autoCreate: false,
  selection: false,
  transport: {
    read: {
      url: 'hmnt/choerodon/v1/0/site/audit/operational/logs?size=5',
      method: 'get',
    },
  },
});

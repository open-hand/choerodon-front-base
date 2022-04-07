export default () => ({
  autoQuery: false,
  paging: false,
  autoCreate: true,
  fields: [
    {
      name: 'memberId', label: '用户', textField: 'realName', valueField: 'id', required: true,
    },
    { name: 'scheduleEntryTime', type: 'date', label: '计划进场时间' },
    { name: 'scheduleExitTime', type: 'date', label: '计划撤场时间' },
  ],
  data: [
    {
      memberId: null,
      scheduleEntryTime: null,
      scheduleExitTime: null,
    },
  ],
});

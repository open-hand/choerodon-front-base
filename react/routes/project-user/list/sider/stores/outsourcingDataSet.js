export default () => ({
  autoQuery: false,
  paging: false,
  autoCreate: true,
  fields: [
    { name: 'scheduleEntryTime', type: 'date', label: '计划进场时间' },
    { name: 'scheduleExitTime', type: 'date', label: '计划撤场时间' },
    {
      name: 'outsourcing', type: 'boolean', label: '是否外包', disabled: true,
    },
    {
      name: 'workingGroup', type: 'string', label: '工作组', disabled: true,
    },
  ],
});

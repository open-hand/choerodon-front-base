import moment from 'moment';

export default () => ({
  autoQuery: false,
  paging: false,
  autoCreate: true,
  fields: [
    {
      name: 'memberId', label: '用户', textField: 'realName', valueField: 'id', required: true,
    },
    {
      name: 'scheduleEntryTime',
      type: 'date',
      label: '计划进场时间',
      validator: (value, name, record) => {
        if (record.get('scheduleExitTime') && moment(record.get('scheduleExitTime')).valueOf() < moment(value).valueOf()) {
          return '进场时间不能大于撤场时间';
        }
        return true;
      },
    },
    {
      name: 'scheduleExitTime',
      type: 'date',
      label: '计划撤场时间',
      validator: (value, name, record) => {
        if (record.get('scheduleEntryTime') && moment(record.get('scheduleEntryTime')).valueOf() > moment(value).valueOf()) {
          return '撤场时间不能小于进场时间';
        }
        return true;
      },
    },
  ],
});

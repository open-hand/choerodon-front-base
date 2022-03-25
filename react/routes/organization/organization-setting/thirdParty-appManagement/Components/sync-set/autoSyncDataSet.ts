import { DataSet } from 'choerodon-ui/pro';

export default ({}): object => ({
  autoCreate: true,
  fields: [
    {
      name: 'timingFlag',
      label: '是否自动同步',
      type: 'boolean',
    },
    {
      name: 'frequency',
      label: '同步频率',
      required: true,
      options: new DataSet({
        data: [{ value: 'DAY', meaning: '一天一次' }, { value: 'WEEK', meaning: '一周一次' }, { value: 'MONTH', meaning: '一月一次' }],
      }),
    },
    {
      name: 'startSyncTime',
      label: '开始同步时间',
      type: 'date',
      required: true,
    },
  ],
});

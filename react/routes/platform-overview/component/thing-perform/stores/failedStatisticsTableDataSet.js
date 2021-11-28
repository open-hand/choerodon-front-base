export default ({ format, formatCommon }) => ({
  selection: false,
  transport: {
    read: ({ data: { date } }) => ({
      url: `/hagd/v1/sagas/instances/statistics/failure/list?date=${date}`,
      method: 'get',
    }),
  },
  fields: [{
    name: 'sagaCode',
    type: 'string',
    label: format({ id: 'thingInstance' }),
  }, {
    name: 'refType',
    type: 'string',
    label: format({ id: 'associatedServiceType' }),
  }, {
    name: 'startTime',
    type: 'string',
    label: formatCommon({ id: 'startTime' }),
  }],
});

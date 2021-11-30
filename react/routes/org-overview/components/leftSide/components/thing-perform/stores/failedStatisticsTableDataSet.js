// eslint-disable-next-line import/no-anonymous-default-export
export default ({ orgId, formatClient }) => ({
  selection: false,
  transport: {
    read: ({ data: { date } }) => ({
      url: `/hagd/v1/sagas/organizations/${orgId}/instances/statistics/failure/list?date=${date}`,
      method: 'get',
    }),
  },
  fields: [{
    name: 'sagaCode',
    type: 'string',
    label: formatClient({ id: 'failedTransactionStatistics' }),
  }, {
    name: 'refType',
    type: 'string',
    label: formatClient({ id: 'transactionInstance' }),
  }, {
    name: 'startTime',
    type: 'string',
    label: formatClient({ id: 'associatedServiceType' }),
  }],
});

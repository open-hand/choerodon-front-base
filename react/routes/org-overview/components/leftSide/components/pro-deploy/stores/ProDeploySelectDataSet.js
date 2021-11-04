import JSONbig from 'json-bigint';

export default ({ orgId, ProDeployStore }) => ({
  fields: [{
    name: 'proSelect',
    type: 'string',
    textField: 'name',
    valueField: 'id',
    multiple: true,
    lookupAxiosConfig: ({
      dataSet, record, params, lookupCode,
    }) => ({
      method: 'get',
      url: `/iam/choerodon/v1/organizations/${orgId}/projects/with_limit`,
      transformResponse(data) {
        let parseData;
        const typeOf = Object.prototype.toString;
        if (typeOf.call(data) === '[object String]') {
          parseData = JSONbig.parse(data).map((i) => ({
            ...i,
            id: i.id.toString(),
          }));
        } else {
          parseData = data;
        }
        if (!record) {
          const initSelected = parseData.map((p) => p.id).splice(0, 3);
          dataSet.loadData([{ proSelect: initSelected }]);
          ProDeployStore.initData(orgId, initSelected);
          ProDeployStore.setProjectArray(JSON.parse(JSON.stringify(parseData)).splice(0, 3));
        } else {
          const chosenArray = record.data.proSelect;
          const allProjects = ProDeployStore.getProjectsArray;
          parseData = [
            ...parseData,
            ...allProjects.filter((a) => chosenArray.includes(a.id)),
          ];
        }
        ProDeployStore.setProjectArray(parseData);
        return parseData;
      },
    }),
  }],
  events: {
    update: ({ record, value, oldValue }) => {
      if (value && value.length > 4) {
        record.set('proSelect', oldValue);
      } else {
        ProDeployStore.initData(orgId, value);
      }
    },
  },
});

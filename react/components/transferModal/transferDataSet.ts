import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import {
  FieldType,
  DataSetSelection,
} from 'choerodon-ui/pro/lib/data-set/enum';
import { DataSet } from 'choerodon-ui/pro';
import { allApiConfig } from '@choerodon/master';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({}): DataSetProps => ({
  autoCreate: true,
  autoQuery: false,
  fields: [
    {
      name: 'user',
      type: 'object' as FieldType,
      textField: 'realName',
      valueField: 'id',
      label: '移交用户',
      required: true,
      options: new DataSet({
        selection: 'single' as DataSetSelection,
        paging: true,
        pageSize: 10,
        autoQuery: true,
        transport: {
          read({ dataSet, record, params: { page } }) {
            const param = dataSet?.getQueryParameter('param');
            return {
              url: allApiConfig.getAllUser().url,
              method: 'get',
              params: {
                organization_id: 0,
                param,
                sort: 'id',
                size: 0,
              },
            };
          },
        },
      }),
    },
  ],
});

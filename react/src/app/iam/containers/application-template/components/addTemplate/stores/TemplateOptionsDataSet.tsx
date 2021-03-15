import { DataSetProps, DataSetSelection } from '@/interface';
import TemplateApis from '@/src/app/iam/containers/application-template/apis';

export default (): DataSetProps => ({
  autoCreate: false,
  autoQuery: false,
  paging: false,
  selection: 'single' as DataSetSelection,
  transport: {
    read: {
      url: TemplateApis.getTemplateList(),
      method: 'get',
    },
  },
});

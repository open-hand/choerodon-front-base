import { DataSetProps, FieldType } from '@/interface';
import GeneralSettingApi from '../apis';

interface TableProps {
  intlPrefix: string,
  formatMessage(arg0: object): string,
  projectId: number,
}

export default ({
  intlPrefix, formatMessage, projectId,
}: TableProps): DataSetProps => ({
  autoCreate: false,
  autoQuery: true,
  selection: false,
  paging: false,
  transport: {
    read: {
      url: GeneralSettingApi.getProjectInfo(projectId),
      method: 'get',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'string' as FieldType,
      label: formatMessage({ id: `${intlPrefix}.name` }),
    },
    {
      name: 'code',
      type: 'string' as FieldType,
      label: formatMessage({ id: `${intlPrefix}.code` }),
    },
    {
      name: 'categories',
      label: formatMessage({ id: `${intlPrefix}.category` }),
    },
    {
      name: 'creationDate',
      label: formatMessage({ id: `${intlPrefix}.creationDate` }),
    },
    {
      name: 'createUserName',
      label: formatMessage({ id: `${intlPrefix}.creator` }),
    },
    {
      name: 'agileProjectCode',
      label: formatMessage({ id: `${intlPrefix}.agile.prefix` }),
    },
    {
      name: 'testProjectCode',
      label: formatMessage({ id: `${intlPrefix}.test.prefix` }),
    },
    {
      name: 'projectEstablishmentTime',
      label: formatMessage({ id: `${intlPrefix}.waterfall.startTime` }),
    },
    {
      name: 'projectConclusionTime',
      label: formatMessage({ id: `${intlPrefix}.waterfall.endTime` }),
    },
    {
      name: 'description',
      label: formatMessage({ id: `${intlPrefix}.description.title` }),
    },
  ],
});

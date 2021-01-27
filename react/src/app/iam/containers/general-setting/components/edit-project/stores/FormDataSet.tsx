import moment from 'moment';
import { DataSetProps, FieldType } from '../../../../../../../../interface';

interface FormProps {
  intlPrefix: string,
  formatMessage(arg0: object): string,
  isShowTestPrefix: boolean,
  isShowAgilePrefix: boolean,
  isWATERFALL: boolean,
}

// 项目名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成   /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/
const nameValidator = (value: string) => {
  if (!value) {
    return '名称必输。';
  }
  if (value.trim() === '') {
    return '名称不能全为空。';
  }
  if (value.length > 110) {
    return '名称长度不能超过110！';
  }
  // eslint-disable-next-line no-useless-escape
  const reg = /^[-—.\w\s\u0800-\u9fa5]{1,110}$/;
  if (!reg.test(value)) {
    return '名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成';
  }
  return true;
};

export default ({
  formatMessage, intlPrefix, isShowTestPrefix, isShowAgilePrefix, isWATERFALL,
}: FormProps): DataSetProps => ({
  autoQuery: false,
  selection: false,
  autoCreate: false,
  paging: false,
  autoQueryAfterSubmit: false,
  transport: {
    update: ({ data: [data] }) => ({
      url: `/iam/choerodon/v1/projects/${data.id}`,
      method: 'put',
      data,
    }),
  },
  // @ts-ignore
  fields: [
    {
      name: 'name',
      type: 'string' as FieldType,
      label: formatMessage({ id: `${intlPrefix}.name` }),
      required: true,
      validator: nameValidator,
    },
    {
      name: 'categories',
      label: formatMessage({ id: `${intlPrefix}.category` }),
      required: true,
    },
    {
      name: 'agileProjectCode',
      label: formatMessage({ id: `${intlPrefix}.agile.prefix` }),
      required: isShowAgilePrefix,
      dynamicProps: {
        maxLength: ({ record }) => (record.dirty ? 5 : null),
      },
    },
    {
      name: 'testProjectCode',
      label: formatMessage({ id: `${intlPrefix}.test.prefix` }),
      required: isShowTestPrefix,
      dynamicProps: {
        maxLength: ({ record }) => (record.dirty ? 5 : null),
      },
    },
    {
      name: 'projectEstablishmentTime',
      label: formatMessage({ id: `${intlPrefix}.waterfall.startTime` }),
      required: isWATERFALL,
      dynamicProps: {
        max: ({ record }) => {
          const endDate = record.get('projectConclusionTime');
          return isWATERFALL && endDate ? moment(endDate, 'YYYY-MM-DD').subtract(1, 'day') : null;
        },
      },
    },
    {
      name: 'projectConclusionTime',
      label: formatMessage({ id: `${intlPrefix}.waterfall.endTime` }),
      required: isWATERFALL,
      dynamicProps: {
        min: ({ record }) => {
          const startDate = record.get('projectEstablishmentTime');
          return isWATERFALL && startDate ? moment.max(moment(startDate, 'YYYY-MM-DD').add(1, 'day'), moment(moment().add(1, 'day').format('YYYY-MM-DD'), 'YYYY-MM-DD')) : moment(moment().add(1, 'day').format('YYYY-MM-DD'), 'YYYY-MM-DD');
        },
      },
    },
  ],
});

// @ts-nocheck
import { DataSet } from 'choerodon-ui/pro';
import { forEach } from 'lodash';
import { DataSetProps, FieldType } from '../../../../../interface';

interface FormProps {
  intlPrefix: string,
  formatMessage(arg0: object): string,
  isShowTestPrefix: boolean,
  isShowAgilePrefix: boolean,
  isWATERFALL: boolean,
  statusDs: DataSet
  categoryDs: DataSet
  infoDs: DataSet
}

const reg = /^[^\u4e00-\u9fa5]+$/;

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
  const Reg = /^[-—.\w\s\u0800-\u9fa5]{1,110}$/;
  if (!Reg.test(value)) {
    return '名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成';
  }
  return true;
};

const exist = (infoDs:DataSet, codeArr:any) => {
  let bool = false;
  codeArr.forEach((item) => {
    if (infoDs?.current?.get('categories')?.findIndex((k:any) => k.code === item) !== -1) {
      bool = true;
    }
  });
  return bool;
};

export default ({
  formatMessage, intlPrefix, isShowTestPrefix, isShowAgilePrefix, isWATERFALL, statusDs, categoryDs,
  infoDs,
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
      name: 'statusId',
      type: 'object',
      label: '项目状态',
      textField: 'name',
      valueField: 'id',
      options: statusDs,
      dynamicProps: {
        required: ({ record }) => record?.status !== 'add'
        ,
      },
    },
    {
      name: 'agileWaterfall',
      type: 'boolean',
      label: '启用冲刺',
      defaultValue: false,
    },
    {
      name: 'description',
      type: 'string' as FieldType,
      label: formatMessage({ id: `${intlPrefix}.description.title` }),
    },
    {
      name: 'categories',
      label: formatMessage({ id: `${intlPrefix}.category` }),
      required: true,
    },
    {
      name: 'agileProjectCode',
      label: formatMessage({ id: `${intlPrefix}.agile.prefix` }),
      // required: isShowAgilePrefix || isWATERFALL,
      dynamicProps: {
        maxLength: ({ record, dataSet }) => (exist(infoDs, ['N_AGILE', 'N_PROGRAM', 'N_WATERFALL']) && record.get('agileProjectCode') !== record.getPristineValue('agileProjectCode') ? 10 : null),
        required: ({ dataSet }) => exist(infoDs, ['N_AGILE', 'N_PROGRAM', 'N_WATERFALL']),
      },
      validator: (value:string) => {
        if (!reg.test(value)) {
          return '工作项前缀不能含有中文';
        }
        return true;
      },
    },
    {
      name: 'testProjectCode',
      label: formatMessage({ id: `${intlPrefix}.test.prefix` }),
      // required: isShowTestPrefix,
      dynamicProps: {
        maxLength: ({ dataSet, record }) => (exist(infoDs, ['N_TEST']) && record.get('testProjectCode') !== record.getPristineValue('testProjectCode') ? 10 : null),
        required: ({ dataSet }) => exist(infoDs, ['N_TEST']),
      },
      validator: (value:string) => {
        if (!reg.test(value)) {
          return '测试前缀不能含有中文';
        }
        return true;
      },
    },
  ],
});

/* eslint-disable consistent-return */
// @ts-nocheck

import pick from 'lodash/pick';
import { FieldType, DataSetProps } from '@/interface';
import EnterprisesApis from '../apis';

interface TableProps {
  intlPrefix: string,
  formatMessage(arg0: object, arg1?: object): string,
}

export default ({ intlPrefix, formatMessage }: TableProps): DataSetProps => {
  const checkPhone = async (value: any) => {
    const p = /^1[3-9]\d{9}$/;
    if (value && !p.test(value)) {
      return '请输入正确的手机号码';
    }
  };

  const checkOrganizationName = (value: any) => {
    const p = /^[A-Za-z0-9\u4e00-\u9fa5_\-\.——]+$/;
    if (value && !p.test(value)) {
      return '组织名只能由中文、大小写字母、数字、.、-、——和_构成';
    }
  };

  const checkEmail = (value: any) => {
    const p = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
    if (value && !p.test(value)) {
      return '请输入正确的邮箱';
    }
  };

  const checkOrganizationCode = (value: any) => {
    const p = /^[a-z](([a-z0-9]|-(?!-))*[a-z0-9])*$/;
    if (value && !p.test(value)) {
      return formatMessage({ id: `${intlPrefix}.code.failed` });
    }
  };

  return ({
    autoCreate: false,
    autoQuery: true,
    selection: false,
    feedback: {
      submitSuccess() {},
      submitFailed() {},
    },
    transport: {
      read: {
        url: EnterprisesApis.getDefaultData(),
        method: 'get',
      },
      submit: ({ data: [data] }: any) => {
        const postData = pick(data, ['adminEmail', 'adminName', 'adminPhone', 'enterpriseType', 'enterpriseName', 'enterpriseScale', 'tenantNum']);
        // @ts-ignore
        postData.organizationName = data.tenantName;

        return ({
          url: EnterprisesApis.updateInfo(),
          method: 'put',
          data: postData,
        });
      },
    },
    fields: [
      {
        name: 'tenantName',
        type: 'string' as FieldType,
        required: true,
        validator: checkOrganizationName,
        maxLength: 32,
        label: formatMessage({ id: `${intlPrefix}.name` }),
      },
      {
        name: 'tenantNum',
        type: 'string' as FieldType,
        required: true,
        validator: checkOrganizationCode,
        label: formatMessage({ id: `${intlPrefix}.code` }),
      },
      {
        name: 'enterpriseName',
        type: 'string' as FieldType,
        required: true,
        label: formatMessage({ id: `${intlPrefix}.business.name` }),
      },
      {
        name: 'enterpriseType',
        type: 'string' as FieldType,
        required: true,
        label: formatMessage({ id: `${intlPrefix}.business.type` }),
      },
      {
        name: 'enterpriseScale',
        type: 'string' as FieldType,
        required: true,
        label: formatMessage({ id: `${intlPrefix}.business.scale` }),
      },
      {
        name: 'adminName',
        type: 'string' as FieldType,
        required: true,
        label: formatMessage({ id: `${intlPrefix}.admin.name` }),
      },
      {
        name: 'adminEmail',
        type: 'string' as FieldType,
        required: true,
        validator: checkEmail,
        label: formatMessage({ id: `${intlPrefix}.business.email` }),
      },
      {
        name: 'adminPhone',
        type: 'string' as FieldType,
        required: true,
        validator: checkPhone,
        label: formatMessage({ id: `${intlPrefix}.phone` }),
      },
      {
        name: 'lastUpdateDate',
        type: 'string' as FieldType,
        required: true,
      },
    ],
  });
};

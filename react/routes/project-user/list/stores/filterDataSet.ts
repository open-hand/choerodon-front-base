/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */

import { DataSet } from 'choerodon-ui/pro';
import { FieldProps, FieldType } from '@/interface';
import { rolesApiConfig } from '@/api';

const mapping: {
 [key: string]: FieldProps
} = {
  params: {
    name: 'params',
    type: 'string' as FieldType,
  },
  role: {
    name: 'roles',
    label: '角色',
    type: 'string' as FieldType,
    textField: 'name',
    valueField: 'id',
    options: new DataSet({
      autoQuery: true,
      transport: {
        read: {
          ...rolesApiConfig.getRoles(true),
        },
      },
    }),
  },
  status: {
    name: 'enabled',
    label: '状态',
    type: 'boolean' as FieldType,
    textField: 'name',
    valueField: 'value',
    options: new DataSet({
      data: [{
        name: '启用',
        value: true,
      }, {
        name: '停用',
        value: false,
      }],
    }),
  },
};
const Index = () => ({
  autoCreate: true,
  fields: Object.keys(mapping).map((key) => mapping[key]),
});

export default Index;

export { mapping };

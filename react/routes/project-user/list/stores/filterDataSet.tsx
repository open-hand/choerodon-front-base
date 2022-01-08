import React from 'react';

import { DataSet } from 'choerodon-ui/pro';
import { C7NFormat } from '@choerodon/master';
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
    type: 'boolean' as FieldType,
    textField: 'name',
    valueField: 'value',
    options: new DataSet({
      data: [{
        name: <C7NFormat intlPreifx="boot" id="enable" />,
        value: true,
      }, {
        name: <C7NFormat id="c7n.teamMember.disabled" />,
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

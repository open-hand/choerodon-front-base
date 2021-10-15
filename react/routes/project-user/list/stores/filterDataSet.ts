/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */

import { FieldProps, FieldType } from '@/interface';

const mapping: {
 [key: string]: FieldProps
} = {
  username: {
    name: 'username',
    label: '用户名',
    type: 'string' as FieldType,
  },
};
const Index = () => ({
  autoCreate: true,
  fields: Object.keys(mapping).map((key) => mapping[key]),
});

export default Index;

export { mapping };

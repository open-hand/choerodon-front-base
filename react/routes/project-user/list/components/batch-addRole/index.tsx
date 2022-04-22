import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  DataSet, Form, Select,
} from 'choerodon-ui/pro';
import { usersApi } from '@/api';
import FormDs from './formDs';

import './index.less';

const cssPrefix = 'c7ncd-projectUser-batchAdd';

const Index = observer(({
  orgUserRoleDataSet,
  orgRoleDataSet,
  dataSet,
  modal,
  afterAdd,
}: {
    orgUserRoleDataSet:DataSet,
    orgRoleDataSet: DataSet
    dataSet: DataSet,
    modal?: any,
    afterAdd?(): void,
}) => {
  const formDs = useMemo(() => new DataSet(FormDs()), []);

  const handleOK = async () => {
    const validateRes = await formDs?.validate();
    if (validateRes) {
      const data: any[] = [];
      dataSet.selected.forEach((itemSelect) => {
        data.push({
          roleIds: formDs?.current?.get('role'),
          memberId: itemSelect.get('id'),
          timeChange: false,
        });
      });
      try {
        await usersApi.batchAddRoles(data);
        if (afterAdd) {
          afterAdd();
        }
        dataSet.unSelectAll();
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  if (modal) {
    modal.handleOk(handleOK);
  }

  return (
    <div className={cssPrefix}>
      <p className={`${cssPrefix}__title`}>
        <span>
          {dataSet.selected.length}
        </span>
        项已选中
      </p>
      <Form dataSet={formDs}>
        <Select name="role" options={orgRoleDataSet} multiple searchable />
      </Form>
    </div>
  );
});

export default Index;

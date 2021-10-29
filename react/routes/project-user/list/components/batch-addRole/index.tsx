import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  DataSet, Form, Select, Button,
} from 'choerodon-ui/pro';
import { usersApi } from '@/api';
import { Record } from '@/interface';

import './index.less';

const cssPrefix = 'c7ncd-projectUser-batchAdd';

const {
  Option,
} = Select;

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
  useEffect(() => {
    orgUserRoleDataSet.reset();
    orgUserRoleDataSet.create();
  }, []);

  const handleOK = async () => {
    const res = await orgUserRoleDataSet.validate();
    if (res) {
      const data: any[] = [];
      dataSet.selected.forEach((itemSelect) => {
        orgUserRoleDataSet.records.forEach((userRoleItem) => {
          data.push({
            roleId: userRoleItem.get('roles'),
            memberId: itemSelect.get('id'),
          });
        });
      });
      try {
        await usersApi.batchAddRoles(data);
        if (afterAdd) {
          afterAdd();
        }
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
      {
        orgUserRoleDataSet.records.map((record) => (
          <Form className={`${cssPrefix}__form`} columns={8} record={record}>
            <Select colSpan={7} name="roles">
              {
                orgRoleDataSet.records.map((roleRecord) => (
                  <Option disabled={orgUserRoleDataSet.records.some((r: Record) => r.get('roles') === roleRecord.get('id'))} value={roleRecord.get('id')}>{ roleRecord.get('name') }</Option>
                ))
              }
            </Select>
            {
              orgUserRoleDataSet.records.length > 1 && (
                <Button
                  className={`${cssPrefix}__form__delete`}
                  icon="delete"
                  onClick={() => orgUserRoleDataSet.delete(record, false)}
                />
              )
            }
          </Form>
        ))
      }
      <Button onClick={() => orgUserRoleDataSet.create()} icon="add">
        添加角色
      </Button>
    </div>
  );
});

export default Index;

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  DataSet, Form, Select, Button,
} from 'choerodon-ui/pro';

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
}: {
    orgUserRoleDataSet:DataSet,
    orgRoleDataSet: DataSet
    dataSet: DataSet,
    modal?: any
}) => {
  useEffect(() => {
    orgUserRoleDataSet.reset();
    orgUserRoleDataSet.create();
  }, []);

  const handleOK = () => false;

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
                  <Option value={roleRecord.get('id')}>{ roleRecord.get('name') }</Option>
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

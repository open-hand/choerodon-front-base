import React, { useState, useMemo } from 'react';
import {
  DataSet, Form, SelectBox, Select, DateTimePicker, message,
} from 'choerodon-ui/pro';
import {
  organizationsApi,
} from '@choerodon/master';
import { observer } from 'mobx-react-lite';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import FormDs from './autoSyncDataSet';

const { Option } = SelectBox;

export interface Props {
  recordData: Record
  refresh: ()=> void
}

const Index: React.FC<Props> = (props) => {
  // @ts-ignore
  const { modal, recordData, refresh } = props;

  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    const obj = recordData?.toData().openAppConfigVO;
    ds.loadData([obj]);
    return ds;
  }, []);

  const handleOk = async () => {
    const validateRes = await formDs.validate();
    if (validateRes) {
      try {
        await organizationsApi.thirdPartyAppEditSyncSetting({
          ...formDs.toData()[0],
          openAppId: recordData.get('id'),
        });
        message.success('修改成功');
        refresh();
        return true;
      } catch (error) {
        console.log(error);
      }
    }
    return false;
  };

  modal.handleOk(handleOk);

  return (
    <Form dataSet={formDs}>
      <SelectBox name="timingFlag">
        <Option value>是</Option>
        <Option value={false}>否</Option>
      </SelectBox>
      <Select name="frequency" />
      <DateTimePicker name="startSyncTime" />
    </Form>

  );
};

export default observer(Index);

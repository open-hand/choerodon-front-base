import React, { useState, useMemo } from 'react';
import {
  DataSet, Form, SelectBox, Select, DateTimePicker,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import FormDs from './autoSyncDataSet';
import { useStore } from '../../stores';

const { Option } = SelectBox;

export interface Props {

}

const Index: React.FC<Props> = (props) => {
  // @ts-ignore
  const { modal } = props;
  const {
    prefixCls,
  } = useStore();

  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    //   ds.loadData([recordData?.toData()]);
    return ds;
  }, []);

  const handleOk = async () => {

  };

  modal.handleOk(handleOk);

  return (
    <Form dataSet={formDs}>
      <SelectBox name="a">
        <Option value>是</Option>
        <Option value={false}>否</Option>
      </SelectBox>
      <Select name="b" />
      <DateTimePicker name="c" />
    </Form>

  );
};

export default observer(Index);

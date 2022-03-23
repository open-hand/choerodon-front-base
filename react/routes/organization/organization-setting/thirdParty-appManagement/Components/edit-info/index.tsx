import React, { useMemo } from 'react';
import {
  DataSet, Form, TextField, Output,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import FormDs from '../../stores/formDataSet';
import { useStore } from '../../stores';

export interface Props {
    recordData: any
}

const EditInfo: React.FC<Props> = (props) => {
  // @ts-ignore
  const { modal, recordData } = props;
  const {
    prefixCls,
  } = useStore();

  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    ds.loadData([recordData?.toData()]);
    return ds;
  }, []);

  const handleOk = async () => {

  };

  modal.handleOk(handleOk);

  return (
    <Form dataSet={formDs}>
      <div>基本信息</div>
      <TextField name="a" />
      <TextField name="b" />
      <div>用户信息</div>
      <TextField name="c" />
      <TextField name="d" />
      <TextField name="e" />
      <TextField name="f" />
    </Form>
  );
};

export default observer(EditInfo);

import React, { useMemo } from 'react';
import {
  DataSet, Form, TextField,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import FormDs from '../../stores/formDataSet';
import './index.less';

export interface Props {
  recordData: any
  prefixCls: string
}

const EditInfo: React.FC<Props> = (props) => {
  // @ts-ignore
  const { modal, recordData, prefixCls } = props;

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
      <div className={`${prefixCls}-edit-form-title`}>基本信息</div>
      <TextField name="appId" />
      <TextField name="appSecret" />
      <div className={`${prefixCls}-edit-form-title`}>用户信息</div>
      <TextField name="openAppConfigVO.loginNameField" />
      <TextField name="openAppConfigVO.emailField" />
      <TextField name="openAppConfigVO.realNameField" />
      <TextField name="openAppConfigVO.phoneField" />
    </Form>
  );
};

export default observer(EditInfo);

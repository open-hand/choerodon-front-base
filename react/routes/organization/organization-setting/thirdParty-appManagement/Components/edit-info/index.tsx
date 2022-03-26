import React, { useMemo, useState } from 'react';
import {
  DataSet, Form, TextField, Button, Icon, message, EmailField,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  organizationsApi,
} from '@choerodon/master';
import { observer } from 'mobx-react-lite';
import FormDs from '../../stores/formDataSet';
import './index.less';

export interface Props {
  recordData: Record
  prefixCls: string
  refresh: ()=> void
}

const EditInfo: React.FC<Props> = (props) => {
  const {
    // @ts-ignore
    modal, recordData, prefixCls, refresh,
  } = props;

  const [connectStatus, setConnectStatus] = useState<any>('pending');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    ds.loadData([recordData?.toData()]);
    return ds;
  }, []);

  const handleOk = async () => {
    const validateRes = await formDs?.current?.validate(true);
    if (validateRes) {
      try {
        recordData.get('id') ? await organizationsApi.thirdPartyAppEdit({
          ...formDs.toData()[0],
        }) : await organizationsApi.thirdPartyAppCreate({
          ...formDs.toData()[0],
        });
        message.success('修改成功');
        refresh();
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return false;
  };

  const handleTestConnectClick = async () => {
    const res = await organizationsApi.thirdPartyAppTestConnection({
      appId: formDs?.current?.get('appId'),
      appSecret: formDs?.current?.get('appSecret'),
      type: recordData.get('type'),
    });
    if (!res.canConnectServer) {
      setErrorMsg('基础连接不通过');
      setConnectStatus('failed');
      return;
    }
    if (!res.canQueryDepartment) {
      setErrorMsg('部门权限获取失败');
      setConnectStatus('failed');
      return;
    }
    if (!res.canQueryUser) {
      setErrorMsg('用户权限获取失败');
      setConnectStatus('failed');
      return;
    }
    setConnectStatus('success');
  };

  modal.handleOk(handleOk);

  return (
    <Form dataSet={formDs}>
      <div className={`${prefixCls}-edit-form-title`}>基本信息</div>
      <TextField name="appId" />
      <TextField name="appSecret" />
      <div className={`${prefixCls}-edit-form-title`}>用户信息</div>
      <TextField name="openAppConfigVO.loginNameField" />
      <EmailField name="openAppConfigVO.emailField" />
      <TextField name="openAppConfigVO.realNameField" />
      <TextField name="openAppConfigVO.phoneField" />
      <div
        className={`${prefixCls}-test-connect`}
        style={{ marginTop: 40, display: 'flex', alignItems: 'center' }}
      >
        <Button onClick={handleTestConnectClick}>测试连接</Button>
        <span className={`${prefixCls}-test-connect-info`}>
          {
            connectStatus === 'success' && (
            <span style={{ color: '#1FC2BB' }}>
              <Icon type="check_circle_outline-o" style={{ marginRight: 6 }} />
              测试连接通过
            </span>
            )
          }
          {
            connectStatus === 'failed' && (
              <span style={{ color: '#F76776' }}>
                <Icon type="dangerous-o" style={{ marginRight: 6 }} />
                {errorMsg}
              </span>
            )
          }
          {
            connectStatus === 'pending' && (
            <span style={{ color: '#9EADBE' }}>未进行测试连接</span>
            )
          }
        </span>
      </div>
    </Form>
  );
};

export default observer(EditInfo);

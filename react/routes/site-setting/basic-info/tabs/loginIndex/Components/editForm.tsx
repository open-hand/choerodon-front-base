import React, {
  useMemo, useCallback,
} from 'react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import {
  Form, TextField, TextArea, DataSet, Select, SelectBox, Icon, message,
} from 'choerodon-ui/pro';
import { systemApi, axios } from '@choerodon/master';
import { ImageCrop, Upload } from 'choerodon-ui';
import FormDs from '../stores/formDataSet';
import './edit.less';

const { Option } = SelectBox;
export interface Iprops {
  recordData: any
  refresh: () => void
}

const Index: React.FC<Iprops> = (props) => {
  const prefixCls = 'c7ncd-system-setting-loginIndex-edit';

  const {
    // @ts-ignore
    modal, AppState, recordData, refresh,
  } = props;

  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    ds.loadData(recordData);
    return ds;
  }, []);

  const beforeUpload = (file: any) => false;

  const hanleImageCropOk = useCallback(async ({ url, blob, area }, type) => {
    //
    function dataURLtoFile(dataurl: any, filename: string) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      // eslint-disable-next-line no-plusplus
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }

    const file = dataURLtoFile(url, `${new Date().getTime()}${AppState.getUserId}${type}`);
    const data = new FormData();
    data.append('file', file);

    const res = await axios.post('/iam/choerodon/v1/users/1/save_photo', data);
    formDs?.current?.set(type, res);
  }, []);

  const handleOk = async () => {
    const validateRes = await formDs.validate();
    if (validateRes) {
      const ajaxData:any = formDs?.toData()[0];
      ajaxData.loginWay = ajaxData.loginWay.toString();
      try {
        await systemApi.editLoginIndexInfo({
          ...ajaxData,
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
    <div className={`${prefixCls}`}>
      <Form dataSet={formDs} columns={2}>
        {/* @ts-ignore */}
        <div colSpan={2} className={`${prefixCls}-imgItem`}>
          <span className="text-title">登录首页Logo</span>
          <div className="img-container img-container1">
            <ImageCrop
              onOk={({ url, blob, area }) => { (hanleImageCropOk({ url, blob, area }, 'loginLogo')); }}
              modalWidth={300}
              // @ts-ignore
              on
              rotate
              zoom
              aspect={5.85 / 1}
              aspectControl
            >
              <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload}>
                <img className="img-logo" src={formDs?.current?.get('loginLogo')} alt="" />
                <div role="none" className="mask">
                  <Icon type="photo_camera" />
                </div>
              </Upload>
            </ImageCrop>
          </div>
        </div>
        <TextField name="loginTitle" colSpan={1} />
        <TextField name="loginInternetContentProvider" colSpan={1} />
        <TextArea name="loginCopyRight" colSpan={2} resize={'vertical' as any} rows={1} />
        <TextField name="loginPhone" colSpan={1} />
        <TextField name="loginEmail" colSpan={1} />
        <TextField name="loginSlogan" colSpan={2} />
        {/* @ts-ignore */}
        <div colSpan={2} className={`${prefixCls}-imgItem`}>
          <span className="text-title">插图</span>
          <div className="img-container img-container2">
            <ImageCrop
              onOk={({ url, blob, area }) => { (hanleImageCropOk({ url, blob, area }, 'loginPage')); }}
              modalWidth={700}
              // @ts-ignore
              on
              rotate
              zoom
              aspect={1.17 / 1}
              aspectControl
            >
              <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload}>
                <img className="img-illustration" src={formDs?.current?.get('loginPage')} alt="" />
                <div role="none" className="mask">
                  <Icon type="photo_camera" />
                </div>
              </Upload>
            </ImageCrop>
          </div>
        </div>
        <Select name="loginWay" colSpan={1} multiple />
        <SelectBox name="loginEnableDingTalkScanningLogin" colSpan={2}>
          <Option value="true">是</Option>
          <Option value="false">否</Option>
        </SelectBox>
        {
          formDs?.current?.get('loginEnableDingTalkScanningLogin') === 'true' && <TextField name="loginDingTalkAppKey" colSpan={1} />
        }
        {
          formDs?.current?.get('loginEnableDingTalkScanningLogin') === 'true' && <TextField name="loginDingTalkAppSecret" colSpan={1} />
        }
      </Form>

    </div>
  );
};

export default injectIntl(inject('AppState')(observer(Index)));

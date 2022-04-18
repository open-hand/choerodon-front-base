import React, { useMemo, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import {
  Form, TextField, TextArea, DataSet, Select, SelectBox, Icon, message,
} from 'choerodon-ui/pro';
import { systemApi } from '@choerodon/master';
import { ImageCrop, Upload } from 'choerodon-ui';
import FormDs from '../stores/formDataSet';
import './edit.less';
import img1 from '../1.svg';
import img2 from '../2.svg';

const { Option } = SelectBox;

const { AvatarUploader } = ImageCrop;

export interface Iprops {
    recordData:any
    refresh:()=>void
}

const Index: React.FC<Iprops> = (props) => {
  const prefixCls = 'c7ncd-system-setting-loginIndex-edit';

  const {
    // @ts-ignore
    modal, AppState, recordData, refresh,
  } = props;

  const [visible, setVisible] = useState(false);

  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    ds.loadData(recordData);
    return ds;
  }, []);

  const hanleImageCropOk = useCallback(({ url, blob, area }) => {
    console.log(url, blob, area);
    setVisible(false);
  }, []);

  const hanleImageCropCancel = () => {

  };

  const handleOk = async () => {
    const validateRes = await formDs.validate();
    if (validateRes) {
      try {
        await systemApi.editLoginIndexInfo({
          ...formDs?.toData()[0],
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
        {/* <div colSpan={2} className={`${prefixCls}-imgItem`}>
          <span className="text-title">登录首页Logo</span>
          <div className="img-container img-container1">
            <img src={img1} alt="" />
            <div role="none" className="mask" onClick={() => { setVisible(true); }}>
              <Icon type="photo_camera" />
            </div>
          </div>
        </div>
        <TextField name="a" colSpan={1} />
        <TextField name="b" colSpan={1} />
        <TextArea name="c" colSpan={2} />
        <TextField name="d" colSpan={1} />
        <TextField name="e" colSpan={1} />
        <TextField name="f" colSpan={2} />
        <div colSpan={2} className={`${prefixCls}-imgItem`}>
          <span className="text-title">插图</span>
          <div className="img-container img-container2">
            <img src={img2} alt="" />
            <div className="mask">
              <Icon type="photo_camera" />
            </div>
          </div>
        </div>
        <Select name="g" colSpan={1} /> */}
        <SelectBox name="loginEnableDingTalkScanningLogin" colSpan={2}>
          <Option value="true">是</Option>
          <Option value="false">否</Option>
        </SelectBox>
        <TextField name="loginDingTalkAppKey" colSpan={1} />
        <TextField name="loginDingTalkAppSecret" colSpan={1} />
      </Form>

      {/* <ImageCrop
        modalVisible={visible}
        onOk={hanleImageCropOk}
        onCancel={hanleImageCropCancel}
        // modalWidth={600}
        modalWidth={212}
        // @ts-ignore
        on
        // src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        src={img2}
        rotate
        zoom
        aspect={5.85 / 1}
        aspectControl
        modalProps={{
          className: 'crop-logo',
        }}
      /> */}

    </div>
  );
};

export default inject('AppState')(observer(Index));

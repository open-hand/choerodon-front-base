import React, { useMemo, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import {
  Form, TextField, TextArea, DataSet, Select, SelectBox, Icon,
} from 'choerodon-ui/pro';
import { ImageCrop, Upload } from 'choerodon-ui';
import FormDs from '../stores/formDataSet';
import './edit.less';
import img1 from '../1.svg';
import img2 from '../2.svg';

const { AvatarUploader } = ImageCrop;

export interface Iprops {

}

const Index: React.FC<Iprops> = (props) => {
  const prefixCls = 'c7ncd-system-setting-loginIndex-edit';
  // @ts-ignore
  const { modal, AppState, intl } = props;

  const [visible, setVisible] = useState(false);

  const [fileList, setFileList] = useState([]);
  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    return ds;
  }, []);

  const hanleImageCropOk = useCallback(({ url, blob, area }) => {
    console.log(url, blob, area);
    setVisible(false);
  }, []);

  const hanleImageCropCancel = () => {

  };

  return (
    <div className={`${prefixCls}`}>
      <Form dataSet={formDs} columns={2}>
        {/* @ts-ignore */}
        <div colSpan={2} className={`${prefixCls}-imgItem`}>
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
        {/* @ts-ignore */}
        <div colSpan={2} className={`${prefixCls}-imgItem`}>
          <span className="text-title">插图</span>
          <div className="img-container img-container2">
            <img src={img2} alt="" />
            <div className="mask">
              <Icon type="photo_camera" />
            </div>
          </div>
        </div>
        <Select name="g" colSpan={1} />
        <SelectBox name="h" colSpan={1} />
        <TextField name="i" colSpan={1} />
        <TextField name="j" colSpan={1} />
      </Form>

      <div className="qwer">
        <ImageCrop
          modalVisible={visible}
          onOk={hanleImageCropOk}
          onCancel={hanleImageCropCancel}
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
        >
          {/* <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            // onPreview={this.handlePreview}
            onChange={handleChange}
            requestFileKeys="imageCropArea"
          /> */}
        </ImageCrop>
      </div>
    </div>
  );
};

export default injectIntl(inject('AppState')(observer(Index)));

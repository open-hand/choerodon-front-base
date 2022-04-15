import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import {
  Form, TextField, TextArea, DataSet, Select, SelectBox, Icon,
} from 'choerodon-ui/pro';
import FormDs from '../stores/formDataSet';
import AvatarUploader from '@/components/avatarUploader';
import './edit.less';
import img1 from '../1.svg';
import img2 from '../2.svg';

export interface Iprops {

}

const Index: React.FC<Iprops> = (props) => {
  const prefixCls = 'c7ncd-system-setting-loginIndex-edit';
  // @ts-ignore
  const { modal, AppState, intl } = props;

  const [visible, setVisible] = useState(false);

  const formDs = useMemo(() => {
    const ds = new DataSet(FormDs({}));
    return ds;
  }, []);

  const aaa = () => {

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

      <AvatarUploader
        title="123"
        visible={visible}
        AppState={AppState}
        intl={intl}
        intlPrefix="global.organization.avatar.edit"
        onVisibleChange={aaa}
        onUploadOk={(url:any) => () => { console.log(url); }}
      />
    </div>
  );
};

export default injectIntl(inject('AppState')(observer(Index)));

import React, {
  useMemo, useCallback,
} from 'react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { inject } from 'mobx-react';
import {
  Form, TextField, TextArea, DataSet, Select, SelectBox, Icon, message, UrlField,
} from 'choerodon-ui/pro';
import { systemApi, axios } from '@choerodon/master';
import { NewTips } from '@choerodon/components';
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

    const res = await axios.post('/hfle/v1/files/multipart?bucketName=iam-service', data);
    formDs?.current?.set(type, res);
  }, []);

  const handleOk = async () => {
    const validateRes = await formDs.validate();
    if (validateRes) {
      const ajaxData: any = formDs?.toData()[0];
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
              modalWidth={750}
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
        <TextField
          name="loginBeian"
          colSpan={1}
          addonAfter={(
            <NewTips
              helpText={(
                <div>
                  ICP备案号是网站是否合法注册经营的标志，可随时到国家工业和信息化部网站备案系统上查询该ICP备案的相关详细信息（https://beian.miit.gov.cn/#/Integrated/index），ICP备案证号一般是省的简称然后是“备”，之后会是八位的ICP备案号，设置后编号指向工信部（beian.miit.gov.cn），参见下面几个正确的格式：
                  <br />
                  1、京公网安备11000002000001号
                  <br />
                  2、京ICP证030173号
                  <br />
                  3、粤公网安备 44030002000001号
                </div>
              )}
            />
          )}
        />
        <TextField
          name="loginCopyRight"
          colSpan={2}
          // resize={'vertical' as any}
          // rows={1}
          addonAfter={(
            <NewTips
              helpText={(
                <div>
                  从法律角度看，加入了伯尔尼公约的国家，版权保护是随着作品（无论是文字，还是图片）的问世即刻就得到版权的保护，
                  作为惯例网站底部的版权声明加强浏览者意识，所观看内容受到版权保护。版权信息遵循格式是：Copyright+ [dates] + [author/owner]，
                  <br />
                  1、Copyright可以写成版权所有符号©，或者是单词“Copyright”的缩写“Copr”；
                  <br />
                  2、日期为首次公开发表的年份，或者是首版发表至今的年份；
                  <br />
                  3、版权拥有者的名称，可以为企业、团体、个人等。
                  <br />
                  参见下面几个正确的格式：
                  <br />
                  1）©2021 Baidu
                  <br />
                  2）© 2003-现在 Taobao.com 版权所有
                  <br />
                  3）Copyright 1998 - 2021 Tencent. All Rights Reserved
                </div>
              )}
            />
          )}
        />
        <TextField name="loginPhone" colSpan={1} />
        <UrlField name="loginEmail" colSpan={1} />
        <TextArea
          name="loginSlogan"
          colSpan={2}
          resize={'vertical' as any}
          rows={2}
        />
        {/* @ts-ignore */}
        <div colSpan={2} className={`${prefixCls}-imgItem`}>
          <span className="text-title">插图</span>
          <div className="img-container img-container2">
            <ImageCrop
              onOk={({ url, blob, area }) => { (hanleImageCropOk({ url, blob, area }, 'loginPage')); }}
              modalWidth={750}
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

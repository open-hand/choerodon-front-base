import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  useFormatCommon, useFormatMessage,
} from '@choerodon/master';
import { Form, Output, Modal } from 'choerodon-ui/pro';
import {
  Content, Header, Breadcrumb, TabPage, HeaderButtons,
  CONSTANTS,
} from '@choerodon/boot';
import { useStore } from './stores/index';
import EditForm from './Components/editForm';

export interface IProps {

}

const {
  MODAL_WIDTH: {
    MIDDLE,
  },
} = CONSTANTS;
const formKey = Modal.key();

const PageContent: React.FC<IProps> = (props) => {
  const {
    intlPrefix, prefixCls, formDs,
  } = useStore();

  useEffect(() => {
    formDs.query();
  }, []);

  const formatCommon = useFormatCommon();
  const formatMessage = useFormatMessage(intlPrefix);

  const refresh = () => {
    formDs.query();
  };

  const handleEdit = () => {
    Modal.open({
      key: formKey,
      title: '修改登录首页',
      children: <EditForm recordData={formDs?.toData()} refresh={refresh} />,
      style: {
        width: MIDDLE,
      },
      okText: '保存',
      drawer: true,
    });
  };

  const renderLoginWay = ({ value, text }:
    { value: Array<string>, text: string }) => {
    const arr = text.split('/');
    if (value) {
      return arr.map((item) => (
        <span className={`${prefixCls}-loginway-tag`}>
          {item}
        </span>
      ));
    }
    return '';
  };

  const renderLoginEnableDingTalkScanningLogin = ({ value }: { value: string }) => (value === 'true' ? '是' : '否');

  return (
    <TabPage>
      <Header>
        <HeaderButtons
          showClassName={false}
          items={([{
            name: '修改登录首页',
            icon: 'edit-o',
            display: true,
            handler: handleEdit,
          }])}
        />
      </Header>
      <Breadcrumb />
      <Content>
        <div className={`${prefixCls}`}>
          <div className={`${prefixCls}-page-left`}>
            <Form labelWidth={150} labelAlign={'left' as any} labelLayout={'horizontal' as any} dataSet={formDs}>
              <Output name="loginTitle" />
              <Output name="loginCopyRight" />
              <Output name="loginBeian" />
              <Output name="loginPhone" />
              <Output name="loginEmail" />
              <Output name="loginSlogan" />
              <Output name="loginWay" renderer={renderLoginWay} />
              <Output name="loginEnableDingTalkScanningLogin" renderer={renderLoginEnableDingTalkScanningLogin} />
              {
                formDs?.current?.get('loginEnableDingTalkScanningLogin') === 'true' && <Output name="loginDingTalkAppKey" />
              }
              {
                formDs?.current?.get('loginEnableDingTalkScanningLogin') === 'true' && <Output name="loginDingTalkAppSecret" />
              }
            </Form>
          </div>
          <div className={`${prefixCls}-page-right`}>
            <div className={`${prefixCls}-page-right-item`} style={{ marginBottom: 20 }}>
              <p>登录首页Logo</p>
              <div className="img-container img-container1">
                <img className="img-logo" src={formDs?.current?.get('loginLogo')} alt="" />
              </div>
            </div>
            <div className={`${prefixCls}-page-right-item`}>
              <p>插图</p>
              <div className="img-container img-container2">
                <img className="img-illustration" src={formDs?.current?.get('loginPage')} alt="" />
              </div>
            </div>
          </div>
        </div>

      </Content>
    </TabPage>
  );
};

export default (observer(PageContent));

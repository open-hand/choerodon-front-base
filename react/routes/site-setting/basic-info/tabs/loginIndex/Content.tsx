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
import img1 from './1.svg';
import img2 from './2.svg';

export interface IProps {

}

const {
  MODAL_WIDTH: {
    MIDDLE,
  },
} = CONSTANTS;
const formKey = Modal.key();

const PageContent:React.FC<IProps> = (props) => {
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

  const renderLoginEnableDingTalkScanningLogin = ({ value }:{value:string}) => (value === 'true' ? '是' : '否');

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
              {/* <Output name="a" />
              <Output name="b" />
              <Output name="c" />
              <Output name="d" />
              <Output name="e" />
              <Output name="f" />
              <Output name="g" />
              <Output name="h" /> */}
              <Output name="loginEnableDingTalkScanningLogin" renderer={renderLoginEnableDingTalkScanningLogin} />
              <Output name="loginDingTalkAppKey" />
              <Output name="loginDingTalkAppSecret" />
            </Form>
          </div>
          {/* <div className={`${prefixCls}-page-right`}>
            <div className={`${prefixCls}-page-right-item`} style={{ marginBottom: 20 }}>
              <p>登录首页Logo</p>
              <div className="img-container img-container1">
                <img src={img1} alt="" />
              </div>
            </div>
            <div className={`${prefixCls}-page-right-item`}>
              <p>插图</p>
              <div className="img-container img-container2">
                <img src={img2} alt="" />
              </div>
            </div>
          </div> */}
        </div>

      </Content>
    </TabPage>
  );
};

export default (observer(PageContent));

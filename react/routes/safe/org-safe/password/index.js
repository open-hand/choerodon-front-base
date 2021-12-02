/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon, Button, Row, Col, Form, Output, Modal,
} from 'choerodon-ui/pro';
import {
  Content, Header, Permission, TabPage, Breadcrumb,
} from '@choerodon/boot';
import { HeaderButtons } from '@choerodon/master';
import Store from '../store';
import EditPassword from './editPassword';

const editModalKey = Modal.key();

export default observer(() => {
  const { passwordPolicyDataSet, orgId, formatClient } = useContext(Store);
  const [visible, setVisible] = useState(false);
  function openPasswordModal() {
    Modal.open({
      key: editModalKey,
      title: '修改密码策略',
      children: <EditPassword dataSet={passwordPolicyDataSet} organizationId={orgId} />,
      style: {
        width: 680,
      },
      drawer: true,
      okText: '保存',
    });
  }
  const renderBoolean = ({ value }) => (value ? '是' : '否');

  return (
    <TabPage service={['choerodon.code.organization.setting.security.ps.password-policy']}>
      <Header>
        <HeaderButtons
          items={([{
            name: formatClient({ id: 'edit' }),
            icon: 'edit-o',
            display: true,
            permissions: ['choerodon.code.organization.setting.security.ps.password-policy.update'],
            handler: openPasswordModal,
          }])}
        />
      </Header>
      <Breadcrumb />
      <Content className="safe-content ml-15">
        <Form pristine dataSet={passwordPolicyDataSet} labelWidth={450} className="tab1">
          <Row>
            <Col span={24}>
              <span className="policyTitle">{formatClient({ id: 'passwordSecurityPolicy' })}</span>
            </Col>
            <Col span={24}>
              <Row>
                <label>{formatClient({ id: 'whethertoEnable' })}</label>
                <Output name="enablePassword" renderer={renderBoolean} />
              </Row>
              {passwordPolicyDataSet.current && passwordPolicyDataSet.current.getPristineValue('enablePassword') ? [
                <Row>
                  <label>{formatClient({ id: 'whetherToEnableRandomPassword' })}</label>
                  <Output name="enableRandomPassword" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'changeTheDefaultPasswordForciblyUponLogin' })}</label>
                  <Output name="forceModifyPassword" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'whetherToAllowThePasswordToBeTheSameAsTheLoginName' })}</label>
                  <Output name="notUsername" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'mandatoryVerificationCode' })}</label>
                  <Output name="forceCodeVerify" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'defaultPasswordOfTheNewUser' })}</label>
                  <Output name="originalPassword" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'minimumPasswordLength' })}</label>
                  <Output name="minLength" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'maximumPasswordLength' })}</label>
                  <Output name="maxLength" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'minimumNumberOfDigits' })}</label>
                  <Output name="digitsCount" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'minimumNumberOfLowercaseLetters' })}</label>
                  <Output name="lowercaseCount" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'minimumNumberOfUppercaseLetters' })}</label>
                  <Output name="uppercaseCount" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'passwordRegular' })}</label>
                  <Output name="regularExpression" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'passwordUpdateFrequency' })}</label>
                  <Output name="passwordUpdateRate" />
                  天
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'passwordExpirationReminder' })}</label>
                  <Output name="passwordReminderPeriod" />
                  天前
                </Row>,
              ] : null}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <span className="policyTitle">{formatClient({ id: 'loginSecurityPolicy' })}</span>
            </Col>
            <Col span={24}>
              <Row>
                <label>{formatClient({ id: 'whethertoEnable' })}</label>
                <Output name="enableSecurity" renderer={renderBoolean} />
              </Row>
              {passwordPolicyDataSet.current && passwordPolicyDataSet.current.getPristineValue('enableSecurity') ? [
                <Row>
                  <label>{formatClient({ id: 'whetherVerificationCode' })}</label>
                  <Output name="enableCaptcha" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'Numberofverificationcodeerrors' })}</label>
                  <Output name="maxCheckCaptcha" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'Enablelockornot' })}</label>
                  <Output name="enableLock" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'maxerrorpsw' })}</label>
                  <Output name="maxErrorTime" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'Thelocktime' })}</label>
                  <Output name="lockedExpireTime" />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'pcLogins' })}</label>
                  <Output name="enableWebMultipleLogin" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'mobileLogins' })}</label>
                  <Output name="enableAppMultipleLogin" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>{formatClient({ id: 'pswChangeReLogin' })}</label>
                  <Output name="loginAgain" renderer={renderBoolean} />
                </Row>,
              ] : null}

            </Col>
          </Row>
        </Form>
      </Content>
    </TabPage>
  );
});

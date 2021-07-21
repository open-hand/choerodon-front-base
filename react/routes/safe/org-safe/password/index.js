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
  const { passwordPolicyDataSet, orgId } = useContext(Store);
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
  function renderBoolean({ value }) {
    return value ? '是' : '否';
  }

  return (
    <TabPage service={['choerodon.code.organization.setting.security.ps.password-policy']}>
      <Header>
        <HeaderButtons
          items={([{
            name: '修改安全策略',
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
              <span className="policyTitle">密码安全策略</span>
            </Col>
            <Col span={24}>
              <Row>
                <label>是否启用</label>
                <Output name="enablePassword" renderer={renderBoolean} />
              </Row>
              {passwordPolicyDataSet.current && passwordPolicyDataSet.current.getPristineValue('enablePassword') ? [
                <Row>
                  <label>是否开启随机密码</label>
                  <Output name="enableRandomPassword" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>登录时强制修改默认密码</label>
                  <Output name="forceModifyPassword" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>是否允许密码与登录名相同</label>
                  <Output name="notUsername" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>强制验证码校验</label>
                  <Output name="forceCodeVerify" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>新用户默认密码</label>
                  <Output name="originalPassword" />
                </Row>,
                <Row>
                  <label>最小密码长度</label>
                  <Output name="minLength" />
                </Row>,
                <Row>
                  <label>最大密码长度</label>
                  <Output name="maxLength" />
                </Row>,
                <Row>
                  <label>最少数字数</label>
                  <Output name="digitsCount" />
                </Row>,
                <Row>
                  <label>最少小写字母数</label>
                  <Output name="lowercaseCount" />
                </Row>,
                <Row>
                  <label>最少大写字母数</label>
                  <Output name="uppercaseCount" />
                </Row>,
                <Row>
                  <label>密码正则</label>
                  <Output name="regularExpression" />
                </Row>,
                <Row>
                  <label>密码更新频率</label>
                  <Output name="passwordUpdateRate" />
                  天
                </Row>,
                <Row>
                  <label>密码到期提醒</label>
                  <Output name="passwordReminderPeriod" />
                  天前
                </Row>,
              ] : null}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <span className="policyTitle">登录安全策略</span>
            </Col>
            <Col span={24}>
              <Row>
                <label>是否启用</label>
                <Output name="enableSecurity" renderer={renderBoolean} />
              </Row>
              {passwordPolicyDataSet.current && passwordPolicyDataSet.current.getPristineValue('enableSecurity') ? [
                <Row>
                  <label>是否开启验证码</label>
                  <Output name="enableCaptcha" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>输错次数</label>
                  <Output name="maxCheckCaptcha" />
                </Row>,
                <Row>
                  <label>是否开启锁定</label>
                  <Output name="enableLock" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>输错次数</label>
                  <Output name="maxErrorTime" />
                </Row>,
                <Row>
                  <label>锁定时长</label>
                  <Output name="lockedExpireTime" />
                </Row>,
                <Row>
                  <label>PC端允许多处登录</label>
                  <Output name="enableWebMultipleLogin" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>移动端允许多处登录</label>
                  <Output name="enableAppMultipleLogin" renderer={renderBoolean} />
                </Row>,
                <Row>
                  <label>修改密码后重新登录</label>
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

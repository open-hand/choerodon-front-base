import React, { useEffect, useState } from 'react';
import {
  Steps, message,
  Icon,
  Spin,
} from 'choerodon-ui';
import {
  Form, TextField, DataSet, Password, CheckBox, Button, Output,
} from 'choerodon-ui/pro';
import { axios } from '@choerodon/boot';
import { observer } from 'mobx-react-lite';
import { useTheme } from '@choerodon/master';
import register1 from './images/register1.gif';
import register2 from './images/register2.gif';
import choerodon from './images/choerodon_logo_color.svg';

import './index.less';

const { Step } = Steps;

// 这里是测试 saas用户的id
let userId;
let instanceId;

const formDataSet = new DataSet({
  autoCreate: true,
  fields: [{
    name: 'orgName',
    type: 'string',
    label: '组织名称',
    required: true,
    maxLength: 30,
  }, {
    name: 'username',
    type: 'string',
    label: '用户名',
    required: true,
    maxLength: 128,
  }, {
    name: 'phone',
    type: 'string',
    label: '手机',
    required: true,
    validator: async (value, name, record) => {
      const myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (!myreg.test(value)) {
        return '手机号格式不正确';
      }
      const res = await axios.get(`/iam/choerodon/v1/register_saas/check_phone?email=${record.get('email')}&phone=${value}`);
      if (!res.success) {
        return res.message;
      }
      return true;
    },
  }, {
    name: 'loginName',
    type: 'string',
    label: '登录名',
  }, {
    name: 'loginAddress',
    type: 'string',
    label: '登录地址',
    defaultValue: 'https://choerodon.com.cn',
  }, {
    name: 'email',
    type: 'string',
    label: '邮箱',
    required: true,
    disabled: true,
  }, {
    name: 'password',
    type: 'string',
    label: '密码',
    required: true,
  }, {
    name: 'checkPassword',
    type: 'string',
    label: '确认密码',
    required: true,
    validator: (value, name, record) => {
      // 如果没写密码
      if (!record.get('password')) {
        return '请先填写密码';
      }
      if (record.get('password') !== value) {
        return '与密码不符合';
      }
      return true;
    },
  }, {
    name: 'agreement',
    type: 'boolean',
  }],
});

export default observer((props) => {
  const [theme, setTheme] = useTheme();

  const [stepIndex, setStepIndex] = useState(0);

  const [registerLoading, setRegisterLoading] = useState(false);

  const [failedStatus, setFailedStatus] = useState(false);

  const [isLdap, setIsLdap] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 如果是ldap 则设置密码框为非必填
    formDataSet.getField('password').set('required', !isLdap);
    formDataSet.getField('password').set('validator', isLdap ? () => true : async (value, name, record) => {
      const res = await axios.get(`/iam/choerodon/v1/register_saas/check_password?password=${value}`);
      if (!res.success) {
        return res.message;
      }
      return true;
    });
    formDataSet.getField('checkPassword').set('required', !isLdap);
    formDataSet.getField('checkPassword').set('validator', isLdap ? () => true : (value, name, record) => {
      // 如果没写密码
      if (!record.get('password')) {
        return '请先填写密码';
      }
      if (record.get('password') !== value) {
        return '与密码不符合';
      }
      return true;
    });
  }, [isLdap]);

  /**
   * 从url获取用户id
   */
  const getUserId = () => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    userId = params.get('crowdId');
    instanceId = params.get('instanceId');
  };

  useEffect(() => {
    if (theme !== 'theme4') {
      props.AppState.setCurrentTheme('theme4');
      setTheme('theme4');
    }
    getUserId();
    if (userId || instanceId) {
      checkUserStatus(userId, formDataSet, instanceId);
    } else {
      setLoading(false);
    }
  }, []);

  const handleGoInto = (ds) => {
    window.location.href = ds.current.get('loginAddress');
  };

  /**
   * 初始查询用户状态
   * @param id
   */
  const checkUserStatus = async (id, ds, selfInstanceId) => {
    try {
      // 如果有userId则是saas 有instanceId就是华为云
      const result = await axios.get(`/iam/choerodon/v1/register_saas/register_status?${id ? `crowd_id=${id}` : `instanceId=${selfInstanceId}`}`);
      // 如果有id说明是saas
      // 失败
      if (result && result.status === 'failed') {
        setFailedStatus(true);
        setLoading(false);
        const {
          userName, phone, email, tenantName,
        } = result;
        ds.loadData([{
          username: userName,
          phone,
          email,
          orgName: tenantName,
        }]);
      } else if (result.status === 'completed') {
        setStepIndex(1);
        getRegisterSuccessInfo(userId, formDataSet);
        setLoading(false);
      } else {
        getUserInfo(ds);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  /**
   * 注册成功查询详情
   */
  const getRegisterSuccessInfo = async (id, ds, selfInstanceId) => {
    const result = await axios.get(`/iam/choerodon/v1/register_saas/register_success?${id ? `crowd_id=${id}` : `instanceId=${selfInstanceId}`}`);
    const {
      organizationName, loginName, userName, loginUrl,
    } = result;
    ds.loadData([{
      orgName: organizationName,
      loginName,
      username: userName,
      loginAddress: loginUrl,
    }]);
  };

  /**
   * 轮询查询状态 处理
   */
  const handlePollingStatus = (id, selfInstanceId) => {
    const polling = setInterval(() => {
      axios.get(`/iam/choerodon/v1/register_saas/register_status?${id ? `crowd_id=${id}` : `instanceId=${selfInstanceId}`}`).then((res) => {
        if (res && res.status === 'completed') {
          clearInterval(polling);
          handlerSetCurrent(1);
          getRegisterSuccessInfo(userId, formDataSet, instanceId);
          setRegisterLoading(false);
        } else if (res.status === 'failed') {
          message.error('注册失败，请重试');
          clearInterval(polling);
          // message.error((
          //   <span>
          //     注册失败，请
          //     <a role="none" onClick={() => handleRetry(id)}>重试</a>
          //   </span>
          // ));
          setFailedStatus(true);
          setRegisterLoading(false);
        }
      });
    }, 1000);
  };

  /**
   * 重试接口
   */
  const handleRetry = (id) => {
    setRegisterLoading(true);
    axios.get(`/iam/choerodon/v1/register_saas/retry?crowd_id=${id}`).then(() => {
      handlePollingStatus(userId);
    });
  };

  /**
   * 获取是否ldap用户 隐藏密码框
   */
  const getIfLdap = async (email) => {
    const result = await axios.get(`/iam/choerodon/v1/register_saas/check_ldap?email=${email}`);
    setIsLdap(result);
  };

  /**
   * 获取开放平台用户信息
   */
  const getUserInfo = async (ds) => {
    const result = await axios.get(`/iam/choerodon/v1/register_saas/saas_user?${userId ? `openUserId=${userId}` : `instanceId=${instanceId}`}`);
    const { userName, phone, email } = result;
    ds.loadData([{
      username: userName,
      phone,
      email,
    }]);
    getIfLdap(email);
  };

  /**
   * 注册事件
   */
  const handleRegister = (dataset) => {
    setRegisterLoading(true);
    const agreement = dataset.current.get('agreement');
    if (!agreement) {
      message.error('请先勾选同意协议');
      setRegisterLoading(false);
    } else {
      dataset.current.validate(true).then((result) => {
        if (result) {
          const {
            orgName,
            username,
            phone,
            email,
            password,
          } = dataset.current.toData();
          axios.post('/iam/choerodon/v1/register_saas', {
            organizationName: orgName,
            userName: username,
            phone,
            email,
            password,
            ...userId ? {
              crowdId: userId,
            } : {
              instanceId,
            },
          }).then(() => {
            handlePollingStatus(userId, instanceId);
          }).catch(() => {
            setRegisterLoading(false);
          });
        } else {
          setRegisterLoading(false);
        }
      });
    }
  };

  /**
   * 步骤内容
   */
  const renderStepContent = (index, ds) => {
    switch (index) {
      case 0: {
        return failedStatus ? (
          <div className="c7ncd-failedStatus">
            <Spin spinning={loading}>
              <div className="c7ncd-failedStatus-content">
                <p className="c7ncd-failedStatus-title">
                  <Icon type="info" />
                  <span>注册失败</span>
                </p>
                <p className="c7ncd-failedStatus-title2">
                  注册失败，请点击下方按钮进行重试，或者直接前往
                  <a>开放平台</a>
                  提工单反馈
                </p>
              </div>
              <Form style={{ marginTop: 32 }} disabled columns={2} labelLayout="float" dataSet={ds}>
                <TextField
                  colSpan={1}
                  name="orgName"
                  help="此处为您的Choerodon猪齿鱼SaaS组织的名称"
                  showHelp="tooltip"
                />
                <TextField
                  colSpan={1}
                  name="username"
                  help="您在Choerodon猪齿鱼中的用户名"
                  showHelp="tooltip"
                  autoComplete="new-password"
                />
                <TextField
                  colSpan={1}
                  name="phone"
                />
                <TextField
                  colSpan={1}
                  name="email"
                  help="邮箱将作为您在Choerodon猪齿鱼中的登录账号与邮件消息的接收地址；此处默认使用开放平台中的邮箱账号"
                  showHelp="tooltip"
                />
              </Form>
              <Button
                loading={registerLoading}
                newLine
                color="primary"
                funcType="raised"
                style={{
                  width: '25%',
                }}
                onClick={() => handleRetry(userId)}
              >
                重试
              </Button>
            </Spin>
          </div>
        ) : (
          <Spin spinning={loading}>
            <Form columns={2} labelLayout="float" dataSet={ds}>
              <TextField
                colSpan={1}
                name="orgName"
                help="此处为您的Choerodon猪齿鱼SaaS组织的名称"
                showHelp="tooltip"
              />
              <TextField
                colSpan={1}
                name="username"
                help="您在Choerodon猪齿鱼中的用户名"
                showHelp="tooltip"
                autoComplete="new-password"
              />
              <TextField
                colSpan={1}
                name="phone"
              />
              <TextField
                colSpan={1}
                name="email"
                help="邮箱将作为您在Choerodon猪齿鱼中的登录账号与邮件消息的接收地址；此处默认使用开放平台中的邮箱账号"
                showHelp="tooltip"
              />
              {
                !isLdap && [
                  <Password
                    colSpan={1}
                    name="password"
                    autoComplete="new-password"
                  />,
                  <Password
                    colSpan={1}
                    name="checkPassword"
                    autoComplete="new-password"
                  />,
                ]
              }
              <CheckBox
                colSpan={1}
                label={(
                  <span>
                    我已阅读并接受
                    <a
                      href="/#/iam/register-organization/serviceAgreement"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '14px',
                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                        fontWeight: 400,
                        color: '#415BC9',
                      }}
                    >
                      《汉得产品市场使用服务协议》
                    </a>
                  </span>
                )}
                name="agreement"
              />
              <Button
                loading={registerLoading}
                newLine
                color="primary"
                funcType="raised"
                style={{
                  width: '50%',
                  marginTop: 40,
                }}
                onClick={() => handleRegister(ds)}
              >
                注册
              </Button>
            </Form>
          </Spin>
        );
        break;
      }
      case 1: {
        return (
          <div className="c7cd-register-saas-step2">
            <p className="c7cd-register-saas-step2-title">
              您已完成注册，可直接进入Choerodon猪齿鱼开始使用。
            </p>
            <div className="c7cd-register-saas-step2-container">
              <Form dataSet={formDataSet} labelLayout="horizontal">
                <Output name="orgName" />
                <Output name="loginName" />
                <Output name="username" />
                <Output name="loginAddress" />
              </Form>
            </div>
            <Button
              color="primary"
              funcType="raised"
              style={{
                width: 200,
                marginTop: 40,
              }}
              onClick={() => handleGoInto(formDataSet)}
            >
              进入使用
            </Button>
          </div>
        );
        break;
      }
      default: {
        return '';
        break;
      }
    }
  };

  /**
   * 改变current函数
   */
  const handlerSetCurrent = (index) => {
    setStepIndex(index);
  };

  return (
    <div className="c7cd-register-saas">
      <div
        className="c7cd-register-saas-img"
      >
        <img
          src={choerodon}
          alt=""
          className="c7cd-register-saas-img-choerodon"
        />
        <img
          className="c7cd-register-saas-img-register"
          src={stepIndex === 0 ? register1 : register2}
        />
      </div>
      <div className="c7cd-register-saas-content">
        <p className="c7cd-register-saas-content-title">注册您的 Choerodon 帐号</p>
        <p className="c7cd-register-saas-content-intro">您需在此维护和确认组织信息与个人账号信息。您的邮箱后续将作为登录Choerodon猪齿鱼平台的账号。</p>
        <Steps current={stepIndex}>
          <Step key={0} title="注册信息填写" />
          <Step key={1} title="注册成功" />
        </Steps>
        <div className="steps-content">
          {
            renderStepContent(stepIndex, formDataSet)
          }
        </div>
      </div>
    </div>
  );
});

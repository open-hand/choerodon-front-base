import React, {
  useRef, useEffect, useState, useImperativeHandle,
} from 'react';
import { message as C7nMessage, Modal } from 'choerodon-ui/pro';
import {
  Form, Input, Select, Button, Row, Col,
} from 'choerodon-ui';
import { FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { axios, Choerodon } from '@choerodon/boot';

import { sendCaptcha } from '../services/password';

const FormItem = Form.Item;
const { Option } = Select;

const intlPrefix = 'user.changepwd';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
};

// 倒计时按钮
const CountdownButton = (props) => {
  // eslint-disable-next-line react/prop-types
  const { onClick = () => {}, ...rest } = props;
  const [countdown, setCountdown] = useState({
    run: false,
    time: -1,
  });
  const endTime = useRef(); // 倒计时结束时间

  const dida = () => {
    const remainTime = Math.round((endTime.current - Date.now()) / 1000);
    const nextCount = {
      run: remainTime > 0,
      time: remainTime,
    };

    setCountdown(nextCount);

    if (remainTime > 0) setTimeout(() => dida(), 1000);
  };

  const handleClick = async () => {
    const time = await onClick();

    endTime.current = Date.now() + 1000 * (time || 60);

    dida();
  };

  if (!countdown.run) return <Button {...rest} onClick={handleClick} />;

  return <Button disabled {...rest}>{`${countdown.time}s`}</Button>;
};

let editFocusInput = React.createRef();
function EditPassword(props) {
  const [enablePwd, setEnablePwd] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [captchaKey, setCaptchaKey] = useState('');
  const [confirmDirty, setConfirmDirty] = useState(undefined);
  const { UserInfoStore, passwordPolicies } = props;
  const [captchaType, setCaptchaType] = useState(() => (UserInfoStore.getUserInfo?.phone ? 'phone' : 'email'));
  const { forceCodeVerify, loginAgain } = passwordPolicies; // 启用了强制验证码验证
  // state = {
  //     submitting: false,
  //     confirmDirty: null,
  //     res: {},
  // };

  const loadEnablePwd = () => {
    axios.get('/iam/choerodon/v1/system/setting/enable_resetPassword').then((response) => {
      setEnablePwd(response);
    });
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const { intl, form } = props;
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.formatMessage({ id: `${intlPrefix}.twopwd.pattern.msg` }));
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    if (value.indexOf(' ') !== -1) {
      callback('密码不能包含空格');
    }
    callback();
  };

  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const handleSubmit = () => {
    const { getFieldValue } = props.form;
    const user = UserInfoStore.getUserInfo;
    const body = {
      originalPassword: getFieldValue('oldpassword'),
      password: getFieldValue('confirm'),
      businessScope: 'UPDATE_PASSWORD',
    };

    if (forceCodeVerify) {
      body.veryfyType = captchaType;
      body.email = getFieldValue('email');
      body.phone = getFieldValue('phone');
      body.captcha = getFieldValue('captcha');
      body.captchaKey = captchaKey;
    }

    props.form.validateFields((err, values) => {
      if (!err) {
        setSubmitting(true);
        UserInfoStore.updatePassword(user.id, body)
          .then(({ failed, message }) => {
            setSubmitting(false);
            // if (failed) {
            //   Choerodon.prompt(message);
            // } else {
            //   Choerodon.logout();
            // }
            if (!failed && loginAgain) {
              Modal.confirm({
                title: '修改密码后需要重新登录，是否确认？',
                onOK: Choerodon.logout(),
              });
              Choerodon.logout();
            } else {
              Choerodon.prompt(message);
            }
          })
          .catch((error) => {
            setSubmitting(false);
            Choerodon.handleResponseError(error);
          });
      }
    });
  };

  useImperativeHandle(props.forwardref, () => ({
    handleSubmit,
  }));

  //   const reload = () => {
  //     const { resetFields } = props.form;
  //     resetFields();
  //   };
  /** 仓库密码修改
      const showModal = () => {
          setState({
              visible: true,
          });
          Modal.confirm({
              className: 'c7n-iam-confirm-modal',
              title: '修改仓库密码',
              content: '确定要修改您的gitlab仓库密码吗？点击确定后，您将跳转至GitLab仓库克隆密码的修改页面。',
              okText: '修改',
              width: 560,
              onOk: () => {
                  const { res: { enable_reset, resetGitlabPasswordUrl } } = this.state;
                  if (enable_reset) {
                      window.open(resetGitlabPasswordUrl);
                  }
              },
          });
      };
   */
  useEffect(() => {
    loadEnablePwd();
  }, []);

  const render = () => {
    const { intl, form } = props;
    const { getFieldDecorator } = form;

    const user = UserInfoStore.getUserInfo;
    const { phone, email } = user;

    // eslint-disable-next-line consistent-return
    const handleGainValidCodeBtnClick = async ({ type }) => {
      try {
        const res = await sendCaptcha({
          type,
          phone,
          email,
        });
        setCaptchaKey(res.captchaKey);
        C7nMessage.success(res.message);
      } catch (error) {
        // C7nMessage[error?.type ?? 'error'](error?.message ?? '发送校验码失败');
        // 返回倒计时时间
        const matchCountDownTime = error?.message?.match(/请(\d+)秒后再发送验证码/)?.[1];
        if (matchCountDownTime) return matchCountDownTime;
      }
    };

    return (
      //   <Page
      //     service={[
      //       'base-service.user.selfUpdatePassword',
      //     ]}
      //   >
      <div className="ldapContainer">
        <Form layout="vertical">
          <FormItem {...formItemLayout}>
            {getFieldDecorator('oldpassword', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.oldpassword.require.msg` }),
                },
                {
                  validator: validateToNextPassword,
                },
              ],
              validateTrigger: 'onBlur',
            })(
              <Input
                autoComplete="off"
                label={<FormattedMessage id={`${intlPrefix}.oldpassword`} />}
                type="password"
                ref={(e) => {
                  editFocusInput = e;
                }}
                showPasswordEye
                disabled={user.ldap}
              />,
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.newpassword.require.msg` }),
                },
                {
                  validator: validateToNextPassword,
                },
              ],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                autoComplete="off"
                label={<FormattedMessage id={`${intlPrefix}.newpassword`} />}
                type="password"
                showPasswordEye
                disabled={user.ldap}
              />,
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({ id: `${intlPrefix}.confirmpassword.require.msg` }),
                },
                {
                  validator: compareToFirstPassword,
                },
              ],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                autoComplete="off"
                label={<FormattedMessage id={`${intlPrefix}.confirmpassword`} />}
                type="password"
                onBlur={handleConfirmBlur}
                showPasswordEye
                disabled={user.ldap}
              />,
            )}
          </FormItem>
          {forceCodeVerify && phone && email && (
            <FormItem required {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: 'phone',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Select
                  // disabled={validCodeSendLimitFlag}
                  onChange={setCaptchaType}
                  style={{ width: '100%' }}
                  label="选择验证类型"
                >
                  <Option value="phone">手机号码</Option>
                  <Option value="email">邮箱</Option>
                </Select>,
              )}
            </FormItem>
          )}
          {forceCodeVerify && captchaType === 'phone' && (
            <FormItem required {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: phone,
              })(<Input disabled label="手机号码" />)}
            </FormItem>
          )}
          {forceCodeVerify && captchaType === 'phone' && (
            <FormItem required {...formItemLayout}>
              <Row gutter={8}>
                <Col span={18}>
                  {getFieldDecorator('captcha', {
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: '短信验证码',
                      },
                    ],
                  })(<Input label="短信验证码" />)}
                </Col>
                <Col span={6}>
                  <CountdownButton
                    style={{ width: 90 }}
                    funcType="raised"
                    onClick={() => handleGainValidCodeBtnClick({
                      type: 'phone',
                    })}
                  >
                    获取验证码
                  </CountdownButton>
                </Col>
              </Row>
            </FormItem>
          )}
          {forceCodeVerify && captchaType === 'email' && (
            <FormItem required {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: email,
              })(<Input label="邮箱" disabled />)}
            </FormItem>
          )}
          {forceCodeVerify && captchaType === 'email' && (
            <FormItem required {...formItemLayout}>
              <Row gutter={8}>
                <Col span={18}>
                  {getFieldDecorator('captcha', {
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: '邮箱验证码',
                      },
                    ],
                  })(<Input label="邮箱验证码" style={{ width: 257, marginRight: 10 }} />)}
                </Col>
                <Col span={6}>
                  <CountdownButton
                    style={{ width: 90 }}
                    funcType="raised"
                    onClick={() => handleGainValidCodeBtnClick({
                      type: 'email',
                    })}
                  >
                    获取验证码
                  </CountdownButton>
                </Col>
              </Row>
            </FormItem>
          )}
        </Form>
      </div>
    );
  };
  return render();
}
export default Form.create({})(observer(EditPassword));

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, Icon, message, Tag,
} from 'choerodon-ui';
import {
  Modal,
  Spin,
  Button,
  DataSet,
  Form as ProForm,
  Output,
  TextField,
  Password,
} from 'choerodon-ui/pro';
import {
  Content,
  Header,
  Page,
  axios,
  Breadcrumb,
  Choerodon,
  HeaderButtons,
  Permission,
} from '@choerodon/boot';
import './Userinfo.less';
import { cloneDeep } from 'lodash';
import TextEditToggle from './textEditToggle';
import EditUserInfo from './EditUserInfo';
import { useStore } from './stores';
import EditPassword from './EditPassword';
import { fetchPasswordPolicies } from '../services/password';
import { userInfoApi } from '@/api';
import AvatarUploader from './AvatarUploader';

const { Text } = TextEditToggle;

const createKey = Modal.key();
const resetGitlabKey = Modal.key();

function UserInfo(props) {
  const context = useStore();
  const {
    AppState,
    UserInfoStore,
    intl,
    intlPrefix,
    prefixCls,
    userId,
    testDs,
  } = context;
  const [editObj, seEditObj] = useState({});
  const [visible, setVisible] = useState(false);

  const openAvatorUploader = () => {
    setVisible(true);
  };
  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible);
  };
  const filishUpAvatar = async (res) => {
    testDs.current.set('imageUrl', res);
    await testDs.submit();
    testDs.query();
  };

  const toSetEdit = (params) => {
    const clone = cloneDeep(editObj);
    clone[params] = !clone[params];
    seEditObj(clone);
  };

  const renderAvatar = () => {
    const avatar = testDs?.current?.get('imageUrl');
    const realName = testDs?.current?.get('realName');
    return (
      <div
        className="user-info-avatar user-info-avatar-modal-edit"
        style={
          avatar && {
            backgroundImage: `url('${Choerodon.fileServer(avatar)}')`,
          }
        }
      >
        {!avatar && realName && realName.charAt(0)}
        <Permission service={[]} type="site">
          <div
            role="none"
            className="user-info-avatar-button"
            onClick={openAvatorUploader}
          >
            <div className="user-info-avatar-button-icon">
              <Icon type="photo_camera" />
            </div>
          </div>

          <AvatarUploader
            id={userId}
            visible={visible}
            onVisibleChange={handleVisibleChange}
            setAvatar={filishUpAvatar}
          />
        </Permission>
      </div>
    );
  };

  function renderUserInfo() {
    let captchaKey; // 获取验证码之后得到
    let key; // 校验验证码之后得到
    let timer = null;

    const ldap = testDs?.current?.get('ldap');
    const phoneBind = testDs?.current?.get('phoneBind');

    const verifyFormDataSet = new DataSet({
      autoCreate: true,
      fields: [
        {
          name: 'phone',
          type: 'string',
          label: '手机号',
          required: true,
          computedProps: {
            disabled: ({ dataSet }) => dataSet.current.get('phone'),
          },
        },
        {
          name: 'password',
          type: 'string',
          label: '短信验证码',
          required: true,
          maxLength: 6,
          validator: (value) => {
            const reg = /^\d{6}$/;
            if (reg.test(value)) {
              return true;
            }
            return '验证码应为6位数字';
          },
        },
      ],
    });

    const pswModifyPhoneDataSet = new DataSet({
      autoCreate: true,
      fields: [
        {
          name: 'password',
          type: 'string',
          label: '密码',
          required: true,
        },
      ],
    });

    const modifyNameDataSet = new DataSet({
      autoCreate: true,
      fields: [
        {
          name: 'realName',
          type: 'string',
          label: '请输入新用户名',
          required: true,
        },
      ],
    });

    const ModifyNameContent = () => (
      <ProForm labelLayout="float" dataSet={modifyNameDataSet}>
        <TextField name="realName" />
      </ProForm>
    );

    const modifyNameOk = () => {
      modifyNameDataSet.validate().then(async (bool) => {
        if (bool) {
          testDs.current.set('realName', modifyNameDataSet.current.get('realName'));
          editPersonInfo();
          return true;
        }
        return false;
      });
    };

    const openModifyNameModal = () => {
      Modal.open({
        key: Math.random(),
        title: '修改用户名',
        children: (
          <ModifyNameContent />
        ),
        okText: '确定',
        onOk: modifyNameOk,
        destroyOnClose: true,
      });
    };

    // 绑定手机号码 或  修改手机号第一步
    const openVerifyCodeModal = (type) => {
      let title;
      let onText;
      let onOk;
      if (type === 'bind') {
        title = '手机号码验证';
        onText = '完成';
        onOk = verifyOk;
      } else if (type === 'modify') {
        title = '更换手机号码';
        onText = '下一步';
        onOk = modifyOk;
      }
      Modal.open({
        // key: createKey,
        key: Math.random(),
        title,
        children: (
          <VerifyModalContent
            type={type}
            phoneNum={testDs.current.get('phone')}
          />
        ),
        okText: onText,
        onOk,
        destroyOnClose: true,
      });
    };

    // 绑定手机号确定
    const verifyOk = async () => {
      let boolean = false;
      const result = await verifyFormDataSet.current.validate();
      if (!result) {
        return boolean;
      }
      if (result && !captchaKey) {
        message.warning('请先获取验证码');
        return boolean;
      }
      const res = await userInfoApi.goVerify({
        phone: testDs.current.get('phone'),
        captcha: verifyFormDataSet.current.get('password'),
        captchaKey,
      });
      if (res.status) {
        boolean = true;
      } else {
        message.warning(res.message);
        boolean = false;
      }
      return boolean;
    };

    // 用短信验证的方式更换手机号的ok
    const modifyOk = async () => {
      // 调确定验证码的接口
      const res = await userInfoApi.goCheckCode({
        phone: verifyFormDataSet.current.get('phone'),
        captcha: verifyFormDataSet.current.get('password'),
        captchaKey,
      });
      console.log(res, 'res');
      if (res.status) {
        key = res.key;
        setTimeout(() => {
          Modal.open({
            key: Math.random(),
            title: '请输入新手机号',
            children: <NewPhoneContent />,
            okText: '确定',
            onOk: () => submitNewPhone('SMS'),
            destroyOnClose: true,
          });
        }, 300);
      }
      message.error(res.message);
      return false;
    };

    // 密码修改已经绑定的手机号
    const PswModifyPhoneContent = () => (
      <ProForm labelLayout="float" dataSet={pswModifyPhoneDataSet}>
        <Password name="password" autoComplete="new-password" />
      </ProForm>
    );
    // 密码修改已经绑定的手机号提交密码
    const PswModifyPhoneSubmitPsw = async (p) => {
      const res = await userInfoApi.goCheckPsw({
        loginName: testDs.current.get('loginName'),
        passWord: pswModifyPhoneDataSet.current.get('password'),
      });
      console.log(res, 'xxxxxxx');
      if (res.status) {
        key = res.key;
        p.modal.close();
        setTimeout(() => {
          Modal.open({
            key: Math.random(),
            title: '请输入新手机号',
            children: <NewPhoneContent />,
            okText: '确定',
            onOk: () => { submitNewPhone('PSW'); },
            destroyOnClose: true,
          });
        }, 300);
        return true;
      }
      message.error(res.message);
      return false;
    };

    const openPswModifyPhone = (p) => {
      p.modal.close();
      setTimeout(() => {
        Modal.open({
          key: Math.random(),
          title: '密码修改手机号',
          children: <PswModifyPhoneContent />,
          okText: '下一步',
          onOk: () => PswModifyPhoneSubmitPsw(p),
          destroyOnClose: true,
        });
      }, 300);
    };

    const VerifyModalContent = (p) => {
      verifyFormDataSet.current.set('phone', p.phoneNum);
      const [btnContent, setBtnContent] = useState('获取验证码');
      useEffect(() => {
        if (typeof btnContent === 'number' && btnContent - 1 >= 0) {
          timer = setTimeout(() => {
            setBtnContent(btnContent - 1);
          }, 1000);
        } else {
          setBtnContent('获取验证码');
        }
      }, [btnContent]);
      useEffect(() => () => {
        clearInterval(timer);
      });
      const btnClick = async () => {
        if (typeof btnContent === 'string') {
          setBtnContent(60);
          // 发送请求
          const res = await userInfoApi.getVerificationCode(
            verifyFormDataSet.current.get('phone'),
          );
          if (res.success) {
            captchaKey = res.captchaKey;
            message.success(res.message);
          } else {
            clearInterval(timer);
            setBtnContent(res.interval);
            message.warning(res.message);
          }
        }
      };
      const content = (
        <div className={`${prefixCls}-vetifyForm-container`}>
          <ProForm
            labelLayout="horizontal"
            labelAlign="left"
            dataSet={verifyFormDataSet}
          >
            <TextField name="phone" />
            <TextField name="password" />
          </ProForm>
          <span
            role="none"
            onClick={btnClick}
            style={{
              color: '#5365EA',
              position: 'absolute',
              bottom: 27,
              right: 26,
              display: 'inline-block',
              height: 30,
              cursor: 'pointer',
              zIndex: 100,
            }}
          >
            {btnContent}
            {' '}
            {typeof btnContent === 'number' ? 's后重新获取' : ''}
          </span>
          {p.type === 'modify' ? (
            <div style={{ textAlign: 'right' }}>
              <span
                role="none"
                onClick={() => {
                  openPswModifyPhone(p);
                }}
                style={{ color: '#415BC9', cursor: 'pointer' }}
              >
                手机无法接收验证码?
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
      );
      return content;
    };

    const newPhoneDataSet = new DataSet({
      autoCreate: true,
      fields: [
        {
          name: 'phone',
          type: 'string',
          label: '新手机号码',
          required: true,
          pattern: /^1[3-9]\d{9}$/,
        },
      ],
    });

    const NewPhoneContent = () => (
      <ProForm dataSet={newPhoneDataSet} labelLayout="float">
        <TextField name="phone" maxLength={11} />
      </ProForm>
    );

    // 新手机号提交
    const submitNewPhone = (submitType) => {
      let type;
      if (submitType === 'SMS') {
        type = 'captcha';
      } else if (submitType === 'PSW') {
        type = 'password';
      }
      newPhoneDataSet.validate().then(async (bool) => {
        console.log(bool);
        if (bool) {
          await userInfoApi.goNewPhoneSubmit({
            phone: newPhoneDataSet.current.get('phone'),
            verifyKey: key,
            type,
          });
          testDs.query();
          return true;
        }
        return false;
      });
    };

    // ----------  修改密码
    const modifyPswFormDataSet = new DataSet({
      autoCreate: true,
      fields: [
        {
          name: 'oldPassword',
          type: 'string',
          label: '原密码',
          required: true,
        },
        {
          name: 'newPassword',
          type: 'string',
          label: '新密码',
          required: true,
        },
        {
          name: 'ggg',
          type: 'string',
          label: '确认密码',
          required: true,
        },
      ],
    });

    const ModifyPswContent = () => (
      <ProForm dataSet={modifyPswFormDataSet} labelLayout="float">
        <Password name="oldPassword" autoComplete="new-password" />
        <Password name="newPassword" autoComplete="new-password" />
        <Password name="ggg" autoComplete="new-password" />
      </ProForm>
    );

    const submitModifyPsw = () => {};

    const openModifyPsw = () => {
      if (ldap) {
        return false;
      }
      Modal.open({
        key: Math.random(),
        title: '修改密码',
        children: <ModifyPswContent />,
        okText: '确定',
        onOk: submitModifyPsw,
        destroyOnClose: true,
      });
      return false;
    };
    // --------render

    const renderEmail = ({ value }) => {
      if (!editObj.email) {
        return (
          <div style={{ position: 'relative' }}>
            <span>{value}</span>
            <span
              className={`${prefixCls}-info-container-fix-text`}
              role="none"
              onClick={() => {
                toSetEdit('email');
              }}
            >
              修改
            </span>
          </div>
        );
      }
      return (
        <div>
          <TextField
            name="email"
            onBlur={() => {
              editPersonInfo('email');
            }}
          />
        </div>
      );
    };

    const renderPhone = ({ value }) => {
      let text = '';
      // ldap 用户不支持手机绑定
      if (ldap) {
        text = '';
      } else if (!ldap) {
        if (phoneBind) {
          text = '修改';
        } else {
          text = '绑定';
        }
      }

      if (!editObj.phone) {
        return (
          <div style={{ position: 'relative' }}>
            <span style={{ marginRight: 12 }}>{value}</span>
            {phoneBind ? (
              <Tag size="small" color="#87d068">
                已绑定
              </Tag>
            ) : (
              <Tag size="small" color="orange">
                未绑定
              </Tag>
            )}
            {phoneBind && (
              <span
                role="none"
                className={`${prefixCls}-info-container-fix-text`}
                onClick={() => {
                  openVerifyCodeModal('modify');
                }}
              >
                {text}
              </span>
            )}
            {!phoneBind && (
              <span
                role="none"
                className={`${prefixCls}-info-container-fix-text`}
                onClick={() => {
                  openVerifyCodeModal('bind');
                }}
              >
                {text}
              </span>
            )}
          </div>
        );
      }
      return null;
    };

    const renderPassword = ({ value }) => (
      <div style={{ position: 'relative' }}>
        <span>*********</span>
        <span
          className={`${prefixCls}-info-container-fix-text`}
          role="none"
          onClick={openModifyPsw}
        >
          <span>修改</span>
        </span>
      </div>
    );

    const renderLanguage = ({ text }) => <span>简体中文</span>;
    const renderTimeZone = ({ text }) => <span>中国</span>;

    const editPersonInfo = async (params) => {
      await testDs.submit();
      testDs.query();
      console.log('go');
      if (params) {
        toSetEdit(params);
      }
    };

    return (
      <>
        <div className={`${prefixCls}-top-container`}>
          <div className={`${prefixCls}-avatar-wrap-container`}>
            {renderAvatar()}
          </div>
          <div className={`${prefixCls}-login-info`}>
            <div>
              {testDs?.current?.get('realName')}
              <span onClick={openModifyNameModal} role="none" style={{ cursor: 'pointer', color: '#5365EA', marginLeft: 6 }}>
                <Icon type="edit-o" />
              </span>
            </div>
            <div>
              {intl.formatMessage({ id: `${intlPrefix}.source` })}
              :
              {ldap
                ? intl.formatMessage({ id: `${intlPrefix}.ldap` })
                : intl.formatMessage({ id: `${intlPrefix}.notldap` })}
            </div>
            <div>
              <span>
                {intl.formatMessage({ id: `${intlPrefix}.loginname` })}
                ：
              </span>
              <Text style={{ fontSize: '13px' }}>
                <span>{testDs?.current?.get('loginName')}</span>
              </Text>
            </div>
          </div>
        </div>
        <div className={`${prefixCls}-info-container`}>
          <ProForm
            dataSet={testDs}
            labelLayout="horizontal"
            labelAlign="left"
            style={{ width: '3.5rem' }}
          >
            <Output
              label={(
                <span className={`${prefixCls}-info-container-info-title`}>
                  账号信息
                </span>
              )}
            />
            <Output name="email" renderer={renderEmail} />
            <Output name="phone" renderer={renderPhone} />
            <Output name="password" renderer={renderPassword} />
            <Output name="language" renderer={renderLanguage} />
            <Output name="timeZone" renderer={renderTimeZone} />
            <Output
              label={(
                <span className={`${prefixCls}-info-container-info-title`}>
                  组织信息
                </span>
              )}
            />
            <Output name="organizationName" />
            <Output name="organizationCode" />
          </ProForm>
        </div>
      </>
    );
  }
  const render = () => (
    <Page>
      <Header className={`${prefixCls}-header`} />
      <Breadcrumb />
      <Content className={`${prefixCls}-container`}>{renderUserInfo()}</Content>
    </Page>
  );
  return render();
}
export default Form.create({})(observer(UserInfo));

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, Icon, message, Tag,
} from 'choerodon-ui';
import {
  Modal,
  Form as ProForm,
  Output,
  TextField,
  Password,
  Tooltip,
} from 'choerodon-ui/pro';
import {
  Content,
  Header,
  Page,
  Breadcrumb,
  Choerodon,
  Permission,
  logout,
} from '@choerodon/boot';
import './Userinfo.less';
import { cloneDeep } from 'lodash';
// import JSEncrypt from '@/utils/jsencrypt.min';
import TextEditToggle from './textEditToggle';
import { useStore } from './stores';
import { iamApi, oauthApi } from '@/api';
import AvatarUploader from './AvatarUploader';

const { Text } = TextEditToggle;
let recordValue = '';

console.log(logout);

function UserInfo(props) {
  const context = useStore();
  const {
    // AppState,
    // UserInfoStore,
    intl,
    intlPrefix,
    prefixCls,
    userId,
    // organizationId,
    userInfoDs,
    verifyFormDataSet,
    pswModifyPhoneDataSet,
    modifyNameDataSet,
    newPhoneDataSet,
    modifyPswFormDataSet,
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
    userInfoDs.current.set('imageUrl', res);
    await userInfoDs.submit();
    userInfoDs.query();
  };

  const toSetEdit = (params, bool) => {
    const clone = cloneDeep(editObj);
    if (bool === undefined) {
      clone[params] = !clone[params];
    } else {
      clone[params] = bool;
    }

    seEditObj(clone);
  };

  const cancelSetEdit = (params) => {
    const clone = cloneDeep(editObj);
    clone[params] = false;
    seEditObj(clone);
    userInfoDs.current.set('email', recordValue);
  };

  const renderAvatar = () => {
    const avatar = userInfoDs?.current?.get('imageUrl');
    const realName = userInfoDs?.current?.get('realName');
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

    const ldap = userInfoDs?.current?.get('ldap');
    const phoneBind = userInfoDs?.current?.get('phoneBind');

    const ModifyNameContent = () => (
      <ProForm labelLayout="float" dataSet={modifyNameDataSet}>
        <TextField name="realName" />
      </ProForm>
    );

    const modifyNameOk = () => {
      modifyNameDataSet.validate().then(async (bool) => {
        if (bool) {
          userInfoDs.current.set(
            'realName',
            modifyNameDataSet.current.get('realName'),
          );
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
        children: <ModifyNameContent />,
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
      verifyFormDataSet.current.reset();
      if (userInfoDs.current.get('phone')) {
        verifyFormDataSet.current.set('phone', userInfoDs.current.get('phone'));
      }
      Modal.open({
        // key: createKey,
        key: Math.random(),
        title,
        children: (
          <VerifyOrNewPhoneModalContent type={type} ds={verifyFormDataSet} />
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
      const res = await oauthApi.goVerify({
        phone: verifyFormDataSet.current.get('phone'),
        loginName: userInfoDs.current.get('loginName'),
        captcha: verifyFormDataSet.current.get('password'),
        captchaKey,
      });
      if (res.status) {
        boolean = true;
        userInfoDs.query();
      } else {
        message.warning(res.message);
      }

      return boolean;
    };

    // 用短信验证的方式更换手机号的ok
    const modifyOk = async () => {
      let boolean = false;
      const result = await verifyFormDataSet.current.validate();
      if (!result) {
        return boolean;
      }
      if (result && !captchaKey) {
        message.warning('请先获取验证码');
        return boolean;
      }
      const res = await oauthApi.goCheckCode({
        phone: verifyFormDataSet.current.get('phone'),
        captcha: verifyFormDataSet.current.get('password'),
        captchaKey,
      });
      if (res.status) {
        boolean = true;
        key = res.key;
        setTimeout(() => {
          Modal.open({
            key: Math.random(),
            title: '请输入新手机号',
            children: <VerifyOrNewPhoneModalContent ds={newPhoneDataSet} />,
            okText: '确定',
            onOk: () => submitNewPhone('SMS'),
            destroyOnClose: true,
          });
        }, 300);
      }
      if (!res.status) {
        message.warning(res.message);
      }
      return boolean;
    };

    // 密码修改已经绑定的手机号
    const PswModifyPhoneContent = () => (
      <ProForm labelLayout="float" dataSet={pswModifyPhoneDataSet}>
        <Password name="password" autoComplete="new-password" />
      </ProForm>
    );
    // 提交密码----密码修改已经绑定的手机号
    const PswModifyPhoneSubmitPsw = async () => {
      let boolean = false;
      const res = await oauthApi.goCheckPsw({
        loginName: userInfoDs.current.get('loginName'),
        passWord: pswModifyPhoneDataSet.current.get('password'),
      });
      if (res.status) {
        key = res.key;
        boolean = true;
        setTimeout(() => {
          Modal.open({
            key: Math.random(),
            title: '请输入新手机号',
            children: <VerifyOrNewPhoneModalContent ds={newPhoneDataSet} />,
            okText: '确定',
            onOk: () => {
              submitNewPhone('PSW');
            },
            destroyOnClose: true,
          });
        }, 300);
      } else if (!res.status) {
        message.error(res.message);
      }
      return boolean;
    };

    const openPswModifyPhone = (p) => {
      p.modal.close();
      setTimeout(() => {
        Modal.open({
          key: Math.random(),
          title: '密码修改手机号',
          children: <PswModifyPhoneContent />,
          okText: '下一步',
          onOk: () => PswModifyPhoneSubmitPsw(),
          destroyOnClose: true,
        });
      }, 300);
    };

    // 绑定、修改手机或新手机号模态窗内容
    const VerifyOrNewPhoneModalContent = (p) => {
      const DS = p.ds;
      if (!p.type) { // 新手机号
        DS.current.reset();
      }
      const [btnContent, setBtnContent] = useState('获取验证码');
      const [phoneValidateSuccess, setPhoneValidateSuccess] = useState(false);
      useEffect(() => {
        async function go() {
          const result = await DS.current.getField('phone').checkValidity();
          if (result) {
            setPhoneValidateSuccess(true);
          }
        }
        go();
      }, []);
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
      const phoneBlur = async () => {
        const result = await DS.current.getField('phone').checkValidity();
        setPhoneValidateSuccess(result);
      };
      const getVerificationCode = async () => {
        const result = await DS.current.getField('phone').checkValidity();
        if (!result) {
          return;
        }
        if (typeof btnContent === 'string') {
          setBtnContent(60);
          // 绑定手机号并且之前没有手机 看输入的手机存不存在
          if (p.type === 'bind' && !userInfoDs.current.get('phone')) {
            try {
              await iamApi.checkPhoneExit({
                phone: DS.current.get('phone'),
              });
            } catch (error) {
              message.error(error.message);
              clearInterval(timer);
              setBtnContent('获取验证码');
              return;
            }
          }
          //  新手机号验证这个手机存不存在
          if (!p.type) {
            try {
              await iamApi.checkPhoneExit({
                phone: DS.current.get('phone'),
              });
            } catch (error) {
              message.error(error.message);
              clearInterval(timer);
              setBtnContent('获取验证码');
              return;
            }
          }
          // 发送请求
          const res = await oauthApi.getVerificationCode(
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
          <ProForm labelLayout="horizontal" labelAlign="left" dataSet={DS}>
            <TextField
              name="phone"
              maxLength={11}
              disabled={p.type ? userInfoDs.current.get('phoneBind') : false}
              onBlur={phoneBlur}
            />
            <TextField maxLength={6} name="password" />
          </ProForm>
          <span
            role="none"
            onClick={getVerificationCode}
            style={
              phoneValidateSuccess
                ? {
                  color: '#5365EA',
                  position: 'absolute',
                  top: 70,
                  right: 26,
                  display: 'inline-block',
                  height: 30,
                  cursor: 'pointer',
                  zIndex: 100,
                }
                : {
                  color: 'rgb(217, 217, 217)',
                  position: 'absolute',
                  top: 70,
                  right: 26,
                  display: 'inline-block',
                  height: 30,
                  cursor: 'not-allowed',
                  zIndex: 100,
                }
            }
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

    // 新手机号提交
    const submitNewPhone = async (submitType) => {
      let type;
      if (submitType === 'SMS') {
        type = 'captcha';
      } else if (submitType === 'PSW') {
        type = 'password';
      }
      const result = await newPhoneDataSet.validate();
      if (result) {
        await oauthApi.goNewPhoneSubmit({
          phone: newPhoneDataSet.current.get('phone'),
          verifyKey: key,
          type,
          loginName: userInfoDs.current.get('loginName'),
          captcha: newPhoneDataSet.current.get('password'),
          captchaKey,
        });
        userInfoDs.query();
        return true;
      }
      return false;
    };

    // ----------  修改密码
    const ModifyPswContent = () => (
      <ProForm dataSet={modifyPswFormDataSet} labelLayout="float">
        <Password name="originPassword" autoComplete="new-password" />
        <Password name="password" autoComplete="new-password" />
        <Password name="ggg" autoComplete="new-password" />
      </ProForm>
    );

    // eslint-disable-next-line max-len
    // const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJL0JkqsUoK6kt3JyogsgqNp9VDGDp+t3ZAGMbVoMPdHNT2nfiIVh9ZMNHF7g2XiAa8O8AQWyh2PjMR0NiUSVQMCAwEAAQ==';

    const submitModifyPsw = async () => {
      // const encrypt = new JSEncrypt();
      // encrypt.setPublicKey(publicKey); // 加密
      const result = await modifyPswFormDataSet.current.validate();
      if (result) {
        const modifyResult = await iamApi.modifyPsw({
          userId,
          originalPassword: modifyPswFormDataSet.current.get('originPassword'),
          password: modifyPswFormDataSet.current.get('password'),
        });
        if (modifyResult.failed) {
          message.error(modifyResult.message);
          return false;
        }
        if (!modifyResult.failed) {
          message.success('修改密码成功');
          setTimeout(() => {
            logout();
          }, 1500);
          return true;
        }
      }
      return false;
    };

    const openModifyPsw = () => {
      if (ldap) {
        return false;
      }
      modifyPswFormDataSet.current.reset();
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
                recordValue = userInfoDs.current.get('email');
                toSetEdit('email');
              }}
            >
              修改
            </span>
          </div>
        );
      }
      return (
        <div
          style={{ position: 'relative' }}
          className={`${prefixCls}-info-container-email-invalid`}
        >
          <span
            className={`${prefixCls}-info-container-fix-text`}
            role="none"
            onMouseDown={() => {
              cancelSetEdit('email');
            }}
          >
            取消
          </span>
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

      let tag;
      if (ldap) {
        tag = (<span />);
      } else {
        tag = phoneBind ? (
          <Tag size="small" color="#87d068">
            已绑定
          </Tag>
        ) : (
          <Tag size="small" color="orange">
            未绑定
          </Tag>
        );
      }

      if (!editObj.phone) {
        return (
          <div style={{ position: 'relative' }}>
            <span style={{ marginRight: 12 }}>{value}</span>
            {tag}
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
        <span className={`${prefixCls}-info-container-fix-text`}>
          {!ldap && (
            <span role="none" onClick={openModifyPsw}>
              修改
            </span>
          )}
          {ldap && (
            <Tooltip title="ldap用户不支持修改密码">
              <span style={{ color: '#9EADBE' }}>修改</span>
            </Tooltip>
          )}
        </span>
      </div>
    );

    const renderLanguage = ({ text }) => <span>简体中文</span>;
    const renderTimeZone = ({ text }) => <span>中国</span>;

    const editPersonInfo = async (params) => {
      const result = await userInfoDs.current.validate();
      if (!result) {
        return;
      }
      await userInfoDs.submit();
      userInfoDs.query();
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
              {userInfoDs?.current?.get('realName')}
              <span
                onClick={openModifyNameModal}
                role="none"
                style={{ cursor: 'pointer', color: '#5365EA', marginLeft: 6 }}
              >
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
                <span>{userInfoDs?.current?.get('loginName')}</span>
              </Text>
            </div>
          </div>
        </div>
        <div className={`${prefixCls}-info-container`}>
          <ProForm
            dataSet={userInfoDs}
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

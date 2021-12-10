// ~~个人信息
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Icon, message, Tag,
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
  useFormatCommon, useFormatMessage, useCurrentLanguage,
} from '@choerodon/master';
import './Userinfo.less';
import { cloneDeep } from 'lodash';
// import JSEncrypt from '@/utils/jsencrypt.min';
import { CaptchaField } from '@choerodon/components/lib/index.js';
import Cookies from 'universal-cookie';
import { injectIntl } from 'react-intl';
import topBg from './assets/bg.svg';
import TextEditToggle from './textEditToggle';
import { useStore } from './stores';
import { iamApi, oauthApi } from '@/api';
import AvatarUploader from './AvatarUploader';

const cookies = new Cookies();

const { Text } = TextEditToggle;
let recordValue = '';

function UserInfo() {
  const context = useStore();
  const {
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
    isOutSide = false,
  } = context;

  const formatCommon = useFormatCommon();
  const formatClient = useFormatMessage(intlPrefix);
  const currentLanguage = useCurrentLanguage();

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
    const ldap = userInfoDs?.current?.get('ldap');
    const phoneBind = userInfoDs?.current?.get('phoneBind');

    const ModifyNameContent = () => (
      <ProForm labelLayout="float" dataSet={modifyNameDataSet}>
        <TextField name="realName" />
      </ProForm>
    );

    const modifyNameOk = () => {
      modifyNameDataSet.current.validate().then(async (bool) => {
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
        children: <VerifyOrNewPhoneModalContent type={type} ds={verifyFormDataSet} />,
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
      const captchaKey = cookies.get('captchaKey');
      if (result && !captchaKey) {
        message.warning('请先获取验证码');
        return boolean;
      }
      const res = await oauthApi.goVerify({
        phone: verifyFormDataSet.current.get('phone'),
        loginName: userInfoDs.current.get('loginName'),
        captcha: verifyFormDataSet.current.get('captcha'),
        captchaKey,
      });
      cookies.set('captchaKey', '');
      if (res.status) {
        boolean = true;
        userInfoDs.query();
      }
      return boolean;
    };

    async function checkPhoneExit(phone, noSelf) {
      if (noSelf) {
        const res = await iamApi.checkPhoneExitNoSelf({
          phone,
          user_id: userId,
        });
        return res;
      } if (!noSelf) {
        const res = await iamApi.checkPhoneExit({
          phone,
          user_id: userId,
        });
        return res;
      }
      return false;
    }

    // 用短信验证的方式更换手机号的ok
    const modifyOk = async () => {
      let boolean = false;
      const result = await verifyFormDataSet.current.validate();
      if (!result) {
        return boolean;
      }
      const captchaKey = cookies.get('captchaKey');
      if (result && !captchaKey) {
        message.warning('请先获取验证码');
        return boolean;
      }
      try {
        const res = await oauthApi.goCheckCode({
          phone: verifyFormDataSet.current.get('phone'),
          captcha: verifyFormDataSet.current.get('captcha'),
          captchaKey,
        });
        cookies.set('captchaKey', '');
        if (res.status) {
          boolean = true;
          cookies.set('verifyKey', res.key);
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
      } catch (error) {
        console.log(error);
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
      const checkRes = await pswModifyPhoneDataSet.current.validate();
      if (!checkRes) {
        return boolean;
      }
      const res = await oauthApi.goCheckPsw({
        loginName: userInfoDs.current.get('loginName'),
        passWord: pswModifyPhoneDataSet.current.get('password'),
      });
      if (res.status) {
        cookies.set('verifyKey', res.key);
        boolean = true;
        setTimeout(() => {
          Modal.open({
            key: Math.random(),
            title: '请输入新手机号',
            children: <VerifyOrNewPhoneModalContent ds={newPhoneDataSet} />,
            okText: '确定',
            onOk: () => submitNewPhone('PSW'),
            destroyOnClose: true,
          });
        }, 300);
      }
      return boolean;
    };

    const openPswModifyPhone = (p) => {
      p.modal.close();
      pswModifyPhoneDataSet.reset();
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
      const { ds: DS, type } = p;
      if (!type) {
        // 新手机号
        DS.current.reset();
      }
      function go() {
        // 新手机号验证、绑定手机号,手机号字段可编辑 看输入的手机存不存在
        if (type !== 'modify') {
          // eslint-disable-next-line consistent-return
          DS.current.getField('phone').set('validator', async (value) => {
            if (!/^1[3-9]\d{9}$/.test(value)) {
              return '手机格式不正确';
            }
            try {
              if (type === 'bind') {
                await checkPhoneExit(DS.current.get('phone'), false);
                return true;
              } if (!type) { // 新手机号
                await checkPhoneExit(DS.current.get('phone'), true);
                return true;
              }
            } catch (error) {
              return error.message;
            }
          });
        } else {
          DS.current.getField('phone').set('validator', () => true);
        }
      }
      go();

      return (
        <div className={`${prefixCls}-vetifyForm-container`}>
          <ProForm labelLayout="horizontal" labelAlign="left" dataSet={DS}>
            <TextField
              name="phone"
              maxLength={11}
              disabled={type === 'modify'}
            />
            <CaptchaField
              name="captcha"
              dataSet={DS}
              type="phone"
              ajaxRequest={oauthApi.getVerificationCode}
            />
          </ProForm>
          {type === 'modify' ? (
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
    };

    // 新手机号提交
    const submitNewPhone = async (submitType) => {
      let type;
      if (submitType === 'SMS') {
        type = 'captcha';
      } else if (submitType === 'PSW') {
        type = 'password';
      }
      const result = await newPhoneDataSet.current.validate();
      if (result) {
        const captchaKey = cookies.get('captchaKey');
        if (result && !captchaKey) {
          message.warning('请先获取验证码');
          return false;
        }
        const submitRes = await oauthApi.goNewPhoneSubmit({
          phone: newPhoneDataSet.current.get('phone'),
          verifyKey: cookies.get('verifyKey'),
          type,
          loginName: userInfoDs.current.get('loginName'),
          captcha: newPhoneDataSet.current.get('captcha'),
          captchaKey: cookies.get('captchaKey'),
        });
        cookies.set('captchaKey', '');
        if (submitRes.status) {
          userInfoDs.query();
          return true;
        }
        return false;
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
              {formatCommon({ id: 'modify' })}
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
            {formatCommon({ id: 'cancel' })}
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
          text = formatClient({ id: 'goTotBind' });
        } else {
          text = formatClient({ id: 'goBind' });
        }
      }

      let tag;
      if (ldap) {
        tag = <span />;
      } else {
        tag = phoneBind ? (
          <Tag size="small" color="#87d068">
            {formatClient({ id: 'bind' })}
          </Tag>
        ) : (
          <Tag size="small" color="orange">
            {formatClient({ id: 'notBind' })}
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
              {formatCommon({ id: 'modify' })}
            </span>
          )}
          {ldap && (
            <Tooltip title="ldap用户不支持修改密码">
              <span style={{ color: '#9EADBE' }}>{formatCommon({ id: 'modify' })}</span>
            </Tooltip>
          )}
        </span>
      </div>
    );

    const renderLanguage = ({ text }) => <span>{formatClient({ id: 'temporary1' })}</span>;
    const renderTimeZone = ({ text }) => <span>{formatClient({ id: 'temporary2' })}</span>;

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
          <img className={`${prefixCls}-top-container-bg`} src={topBg} alt="" />
          <div className={`${prefixCls}-top-container-conent`}>
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
                {formatClient({ id: 'source' })}
                :
                {ldap
                  ? formatClient({ id: 'ldap' })
                  : formatClient({ id: 'noLdap' })}
              </div>
              <div>
                <span>
                  {formatCommon({ id: 'account' })}
                  ：
                </span>
                <Text style={{ fontSize: '13px' }}>
                  <span>{userInfoDs?.current?.get('loginName')}</span>
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className={`${prefixCls}-info-container`}>
          <ProForm
            dataSet={userInfoDs}
            labelLayout="horizontal"
            labelAlign="left"
            style={currentLanguage === 'en_US' ? { width: '5rem' } : { width: '3.5rem' }}
          >
            <Output
              labelWidth={currentLanguage === 'en_US' ? 200 : 100}
              label={(
                <span className={`${prefixCls}-info-container-info-title`}>
                  {formatClient({ id: 'account' })}
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
                  {formatClient({ id: 'organization' })}
                </span>
              )}
            />
            {!isOutSide ? ([
              <Output name="organizationName" />,
              <Output name="organizationCode" />,
            ]) : null}
          </ProForm>
        </div>
      </>
    );
  }

  const render = () => (isOutSide ? (
    <Content className={`${prefixCls}-container`}>{renderUserInfo()}</Content>
  ) : (
    <Page>
      <Header className={`${prefixCls}-header`} />
      <Breadcrumb />
      <Content className={`${prefixCls}-container`}>{renderUserInfo()}</Content>
    </Page>
  )
  );
  return render();
}
export default injectIntl(observer(UserInfo));

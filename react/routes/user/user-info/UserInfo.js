import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, Icon, Modal as OldModal, message,
} from 'choerodon-ui';
import {
  Modal,
  Spin,
  Button,
  DataSet,
  Form as ProForm,
  TextField,
} from 'choerodon-ui/pro';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Content,
  Header,
  Page,
  axios,
  Breadcrumb,
  Choerodon,
  HeaderButtons,
} from '@choerodon/boot';
import './Userinfo.less';
import TextEditToggle from './textEditToggle';
import EditUserInfo from './EditUserInfo';
import { useStore } from './stores';
import EditPassword from './EditPassword';
import { fetchPasswordPolicies } from '../services/password';
import { userInfoApi } from '@/api';

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
  } = context;
  const [enablePwd, setEnablePwd] = useState({});
  const [avatar, setAvatar] = useState('');
  const modalRef = React.createRef();
  const loadUserInfo = () => {
    UserInfoStore.loadUserInfo().then((data) => {
      // AppState.setUserInfo(data);
      UserInfoStore.setUserInfo(data);
      setAvatar(UserInfoStore.getAvatar);
    });
  };

  const loadEnablePwd = () => {
    axios
      .get('/iam/choerodon/v1/system/setting/enable_resetPassword')
      .then((response) => {
        setEnablePwd(response);
      });
  };

  function renderAvatar({ id, realName }) {
    const image = avatar && {
      backgroundImage: `url('${Choerodon.fileServer(avatar)}')`,
    };
    return (
      <div className={`${prefixCls}-avatar-wrap`}>
        <div className={`${prefixCls}-avatar`} style={image || {}}>
          {!avatar && realName && realName.charAt(0)}
        </div>
      </div>
    );
  }

  function renderUserInfo(user) {
    const {
      loginName,
      realName,
      email,
      language,
      timeZone,
      phone,
      ldap,
      organizationName,
      organizationCode,
      internationalTelCode,
      phoneBind,
    } = user;

    let captchaKey;
    let timer = null;

    const verifyFormDataSet = new DataSet({
      autoCreate: true,
      fields: [
        {
          name: 'phone',
          type: 'string',
          label: '手机号',
          required: true,
          disabled: true,
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

    const VerifyModalContent = (p) => {
      verifyFormDataSet.current.reset();
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
      const addonAfter = (
        <span
          role="none"
          onClick={btnClick}
          style={{
            cursor: 'pointer',
            display: 'inline-block',
            width: 60,
            textAlign: 'center',
          }}
        >
          {btnContent}
        </span>
      );
      const content = (
        <div className={`${prefixCls}-vetifyForm-container`}>
          <ProForm
            labelLayout="horizontal"
            labelAlign="left"
            dataSet={verifyFormDataSet}
          >
            <TextField name="phone" />
            <TextField name="password" addonAfter={addonAfter} />
          </ProForm>
        </div>
      );
      return content;
    };

    const verifyModalOk = async () => {
      // console.log(verifyFormDataSet.current.validate());
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
        phone,
        captcha: verifyFormDataSet.current.get('password'),
        captchaKey,
      });
      if (res.status) {
        loadUserInfo();
        boolean = true;
      } else {
        message.warning(res.message);
        boolean = false;
      }
      return boolean;
    };

    const openVerifyModal = () => {
      Modal.open({
        // key: createKey,
        key: Math.random(),
        title: '手机号码验证',
        children: <VerifyModalContent phoneNum={phone} />,
        okText: '完成',
        onOk: verifyModalOk,
        destroyOnClose: true,
      });
    };

    return (
      <>
        <div className={`${prefixCls}-top-container`}>
          <div className={`${prefixCls}-avatar-wrap-container`}>
            {renderAvatar(user)}
          </div>
          <div className={`${prefixCls}-login-info`}>
            <div>{realName}</div>
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
                <span>{loginName}</span>
              </Text>
            </div>
          </div>
        </div>
        <div className={`${prefixCls}-info-container`}>
          <div className={`${prefixCls}-info-container-account`}>
            <div>
              {intl.formatMessage({ id: `${intlPrefix}.account.info` })}
            </div>
            <div>
              <div>
                <span className={`${prefixCls}-info-container-account-title`}>
                  {intl.formatMessage({ id: `${intlPrefix}.email` })}
                </span>
                <span className={`${prefixCls}-info-container-account-content`}>
                  {email}
                </span>
              </div>
              <div>
                <span className={`${prefixCls}-info-container-account-title`}>
                  {intl.formatMessage({ id: `${intlPrefix}.phone` })}
                </span>

                {ldap && (
                  <span
                    className={`${prefixCls}-info-container-account-content`}
                  >
                    {phone === null ? '无' : phone}
                  </span>
                )}

                {!ldap && (
                  <span
                    className={`${prefixCls}-info-container-account-content`}
                  >
                    {phoneBind && ( // 已验证
                      <span
                        className={`${prefixCls}-info-container-account-content-success`}
                      >
                        <Icon type="check_circle" style={{ marginRight: 6 }} />
                        {phone}
                        <span style={{ marginLeft: 6 }}>已验证</span>
                      </span>
                    )}
                    {!phoneBind && ( // 未验证
                      <div style={{ display: 'flex' }}>
                        <span>{phone === null ? '无' : phone}</span>
                        {phone !== null && (
                          <Button
                            onClick={openVerifyModal}
                            style={{
                              marginLeft: 10,
                              position: 'relative',
                              top: -5,
                            }}
                            type="dashed"
                          >
                            验证手机号码
                          </Button>
                        )}
                      </div>
                    )}
                  </span>
                )}
              </div>
              <div>
                <span className={`${prefixCls}-info-container-account-title`}>
                  {intl.formatMessage({ id: `${intlPrefix}.language` })}
                </span>
                <span
                  className={`${prefixCls}-info-container-account-content ${prefixCls}-info-container-account-content-short`}
                >
                  简体中文
                </span>
              </div>
              <div>
                <span className={`${prefixCls}-info-container-account-title`}>
                  {intl.formatMessage({ id: `${intlPrefix}.timezone` })}
                </span>
                <span
                  className={`${prefixCls}-info-container-account-content ${prefixCls}-info-container-account-content-short`}
                >
                  中国
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`${prefixCls}-info-container`}>
          <div className={`${prefixCls}-info-container-account`}>
            <div>{intl.formatMessage({ id: `${intlPrefix}.orginfo` })}</div>
            <div>
              <div>
                <span className={`${prefixCls}-info-container-account-title`}>
                  {intl.formatMessage({ id: `${intlPrefix}.org.name` })}
                </span>
                <span
                  className={`${prefixCls}-info-container-account-content `}
                >
                  {organizationName}
                </span>
              </div>
              <div>
                <span className={`${prefixCls}-info-container-account-title`}>
                  {intl.formatMessage({ id: `${intlPrefix}.org.code` })}
                </span>
                <span
                  className={`${prefixCls}-info-container-account-content `}
                >
                  {organizationCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function handleUpdateInfo() {
    Modal.open({
      key: createKey,
      title: '修改信息',
      style: {
        width: 380,
      },
      drawer: true,
      children: (
        <EditUserInfo
          // {...props}
          intl={intl}
          AppState={AppState}
          resetAvatar={setAvatar}
          intlPrefix={intlPrefix}
          forwardref={modalRef}
          UserInfoStore={UserInfoStore}
          loadUserInfo={loadUserInfo}
        />
      ),
      okText: '保存',
      onOk: () => {
        modalRef.current.handleSubmit();
        return false;
      },
    });
  }

  function goToGitlab() {
    const { resetGitlabPasswordUrl } = enablePwd;
    if (enablePwd.enable_reset) {
      window.open(resetGitlabPasswordUrl);
    }
  }

  function handleUpdateStore() {
    Modal.confirm({
      key: Modal.key(),
      title: '修改GitLab密码',
      content:
        '确定要修改您的gitlab仓库密码吗？确定修改后，您将跳转至GitLab仓库密码的修改页面。',
      okText: '修改',
      onOk: goToGitlab,
    });
  }

  async function handleUpdatePassword() {
    const user = UserInfoStore.getUserInfo;
    let passwordPolicies;
    try {
      passwordPolicies = await fetchPasswordPolicies(
        AppState.currentMenuType?.organizationId,
      );
    } catch (err) {
      return false;
    }

    Modal.open({
      key: createKey,
      title: '修改登录密码',
      style: {
        width: 380,
      },
      drawer: true,
      children: (
        <EditPassword
          // {...props}
          intl={intl}
          intlPrefix={intlPrefix}
          forwardref={modalRef}
          UserInfoStore={UserInfoStore}
          passwordPolicies={passwordPolicies}
        />
      ),
      okText: '保存',
      onOk: () => {
        modalRef.current.handleSubmit();
        return false;
      },
      footer: (okBtn, cancelBtn) => (
        <div>
          {cancelBtn}
          {!user.ldap ? okBtn : React.cloneElement(okBtn, { disabled: true })}
        </div>
      ),
    });

    return true;
  }

  function handleCopy() {
    Choerodon.prompt('复制成功');
  }

  async function handleResetGitlab(modal) {
    modal.update({
      children: <Spin spinning />,
      footer: null,
    });
    try {
      const res = await UserInfoStore.resetPassword(userId);
      if (res && !res.falied) {
        const children = (
          <div className={`${prefixCls}-reset-content`}>
            <span>您的GitLab密码已被重置为：</span>
            <span className={`${prefixCls}-reset-content-password`}>{res}</span>
            <CopyToClipboard text={res} onCopy={handleCopy}>
              <Icon
                type="content_copy"
                className={`${prefixCls}-reset-content-icon`}
              />
            </CopyToClipboard>
            <div>
              为了您的账号安全，请复制以上密码，并尽快前往GitLab修改重置后的密码。
            </div>
          </div>
        );
        modal.update({
          children,
          okText: '前往修改密码',
          onOk: goToGitlab,
          footer: (okBtn, cancelBtn) => (
            <div>
              {cancelBtn}
              {okBtn}
            </div>
          ),
        });
      } else {
        modal.update({
          children: <Spin spinning />,
          footer: (okBtn, cancelBtn) => cancelBtn,
        });
      }
    } catch (e) {
      modal.update({
        children: <Spin spinning />,
        footer: (okBtn, cancelBtn) => cancelBtn,
      });
    }
    return false;
  }

  function openResetGitlab() {
    const resetModal = Modal.open({
      key: resetGitlabKey,
      title: '重置GitLab密码',
      children:
        '确定要重置您当前的gitlab仓库密码吗？密码重置后，为了您的账号安全，请务必尽快修改重置后的密码。',
      okText: '重置',
      movable: false,
      onOk: () => handleResetGitlab(resetModal),
    });
  }

  useEffect(() => {
    loadUserInfo();
    loadEnablePwd();
  }, []);

  const render = () => {
    const user = UserInfoStore.getUserInfo;
    return (
      <Page>
        <Header className={`${prefixCls}-header`}>
          <HeaderButtons
            showClassName={false}
            items={[
              {
                name: '修改信息',
                icon: 'edit-o',
                display: true,
                permissions: [],
                handler: handleUpdateInfo.bind(this),
              },
              {
                name: '修改登录密码',
                icon: 'edit-o',
                display: true,
                permissions: [],
                handler: handleUpdatePassword.bind(this),
                disabled: AppState.getUserInfo.ldap,
                tooltipsConfig: {
                  title: AppState.getUserInfo.ldap
                    ? 'LDAP用户无法修改登录密码'
                    : '',
                },
              },
            ]}
          />
        </Header>
        <Breadcrumb />
        <Content className={`${prefixCls}-container`}>
          {renderUserInfo(user)}
        </Content>
      </Page>
    );
  };
  return render();
}
export default Form.create({})(observer(UserInfo));

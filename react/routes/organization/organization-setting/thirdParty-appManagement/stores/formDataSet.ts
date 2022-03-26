import { organizationsApiConfig } from '@choerodon/master';

const checkPhone = async (value: any) => {
  const p = /^1[3-9]\d{9}$/;
  if (value && !p.test(value)) {
    return '请输入正确的手机号码';
  }
  return true;
};

export default ({ }): object => ({
  autoCreate: true,
  autoQuery: true,
  fields: [
    {
      name: 'appId',
      label: 'AppID',
      required: true,
    },
    {
      name: 'appSecret',
      label: 'AppSecret',
      required: true,
    },
    {
      name: 'openAppConfigVO.loginNameField',
      label: '登录名',
      required: true,
    },
    {
      name: 'openAppConfigVO.emailField',
      label: '邮箱',
      required: true,
      type: 'email',
    },
    {
      name: 'openAppConfigVO.realNameField',
      label: '名称',
    },
    {
      name: 'openAppConfigVO.phoneField',
      label: '电话',
      validator: checkPhone,
    },
  ],
  transport: {
    read: {
      url: organizationsApiConfig.thirdPartyAppList().url,
      method: 'get',
    },
  },
});

import Api from './Api';

class OauthApi extends Api<OauthApi> {
  get prefix() {
    return '/oauth/choerodon';
  }

  // 获取验证码
  getVerificationCode(phone: string) {
    return this.request({
      method: 'get',
      // url: '/oauth/public/send-phone-captcha',
      url: `${this.prefix}/public/new/send-phone-captcha`,
      params: {
        phone,
      },
    });
  }

  // 绑定
  goVerify(data:object) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/bind/user/phone`,
      params: data,
    });
  }

  // 校验验证码的接口
  goCheckCode(data:object) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/verify/captcha`,
      params: data,
    });
  }

  // 校验密码
  goCheckPsw(data:object) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/verify/password`,
      params: data,
    });
  }

  // 修改手机号提交
  goNewPhoneSubmit(data: object) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/update/user/phone`,
      params: data,
    });
  }
}

const oauthApi = new OauthApi();
const oauthApiConfig = new OauthApi(true);
export { oauthApi, oauthApiConfig };

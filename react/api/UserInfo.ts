import Api from './Api';

class UserInfoApi extends Api<UserInfoApi> {
  getVerificationCode(phone: string) {
    return this.request({
      method: 'get',
      url: '/oauth/public/send-phone-captcha',
      params: {
        phone,
      },
    });
  }

  goVerify(data:object) {
    return this.request({
      method: 'post',
      url: '/oauth/choerodon/bind/user/phone',
      params: data,
    });
  }

  // 校验验证码的接口
  goCheckCode(data:object) {
    return this.request({
      method: 'post',
      url: '/oauth/choerodon/verify/captcha',
      params: data,
    });
  }

  // 校验密码
  goCheckPsw(data:object) {
    return this.request({
      method: 'post',
      url: '/oauth/choerodon/verify/password',
      params: data,
    });
  }

  // 修改手机号提交
  goNewPhoneSubmit(data: object) {
    return this.request({
      method: 'post',
      url: '/oauth/choerodon/update/user/phone',
      params: data,
    });
  }
}

const userInfoApi = new UserInfoApi();
const userInfoApiConfig = new UserInfoApi(true);
export { userInfoApi, userInfoApiConfig };

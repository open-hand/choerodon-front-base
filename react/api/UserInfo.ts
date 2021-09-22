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
}

const userInfoApi = new UserInfoApi();
const userInfoApiConfig = new UserInfoApi(true);
export { userInfoApi, userInfoApiConfig };

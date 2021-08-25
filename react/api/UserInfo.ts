import Api from './Api';

class UserInfoApi extends Api<UserInfoApi> {
  getVerificationCode(phone: string) {
    return this.request({
      method: 'get',
      url: 'http://172.23.16.154:30094/oauth/public/send-phone-captcha',
      params: {
        phone,
      },
    });
  }

  goVerify(data:object) {
    return this.request({
      method: 'post',
      url: 'http://172.23.16.154:30094/oauth/choerodon/bind/user/phone',
      params: data,
    });
  }
}

const userInfoApi = new UserInfoApi();
const userInfoApiConfig = new UserInfoApi(true);
export { userInfoApi, userInfoApiConfig };

import Api from './Api';

class UserInfoApi extends Api<UserInfoApi> {
  // 获取验证码
  getVerificationCode(phone: string) {
    return this.request({
      method: 'get',
      // url: '/oauth/public/send-phone-captcha',
      url: '/choerodon/public/new/send-phone-captcha',
      params: {
        phone,
      },
    });
  }

  // 绑定
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

  // 看手机存不存在
  checkPhoneExit(data:object) {
    return this.request({
      method: 'post',
      url: '/iam/choerodon/v1/users/check',
      data,
    });
  }

  // 修改密码
  modifyPsw(data:{organizationId:string, password:string, originPassword:string}) {
    return this.request({
      method: 'put',
      url: `/iam/choerodon/v1/users/${data.organizationId}/password`,
      data: {
        password: data.password,
        originPassword: data.originPassword,
      },
    });
  }
}

const userInfoApi = new UserInfoApi();
const userInfoApiConfig = new UserInfoApi(true);
export { userInfoApi, userInfoApiConfig };

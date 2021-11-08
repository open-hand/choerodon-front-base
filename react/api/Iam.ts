import Api from './Api';

class IamApi extends Api<IamApi> {
  get prefix() {
    return '/iam/choerodon/v1/users';
  }

  // 看手机存不存在(自己的手机校验也成功)
  checkPhoneExit(data:object) {
    return this.request({
      method: 'get',
      url: `${this.prefix}/check/user/phone/occupied`,
      params: data,
    });
  }

  // 看手机存不存在(自己的手机校验不成功)
  checkPhoneExitNoSelf(data:object) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/check`,
      data,
    });
  }

  // 修改密码
  modifyPsw(data:{ password:string, originalPassword:string, userId:string}) {
    return this.request({
      method: 'put',
      url: `${this.prefix}/${data.userId}/password`,
      data: {
        password: data.password,
        originalPassword: data.originalPassword,
        businessScope: 'UPDATE_PASSWORD',
      },
    });
  }
}

const iamApi = new IamApi();
const iamApiConfig = new IamApi(true);
export { iamApi, iamApiConfig };

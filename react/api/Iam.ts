import Api from './Api';

class IamApi extends Api<IamApi> {
  get prefix() {
    return '';
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
  modifyPsw(data:{ password:string, originalPassword:string, userId:string}) {
    return this.request({
      method: 'put',
      url: `/iam/choerodon/v1/users/${data.userId}/password`,
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

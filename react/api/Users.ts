import Api from './Api';

class UsersApi extends Api<UsersApi> {
  get prefix() {
    return `/iam/choerodon/v1/projects/${this.projectId}/users`;
  }

  /**
   * 批量添加角色
   * @param data
   */
  batchAddRoles(data: any) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/assign_roles`,
      data,
    });
  }
}

const usersApi = new UsersApi();
const usersApiConfig = new UsersApi(true);
export { usersApi, usersApiConfig };

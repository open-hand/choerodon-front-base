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

  /**
   * 批量删除角色
   */
  batchDelete(userIdList: string[]) {
    return this.request({
      method: 'post',
      url: `${this.prefix}/role_members/batch_delete`,
      data: userIdList,
    });
  }
}

const usersApi = new UsersApi();
const usersApiConfig = new UsersApi(true);
export { usersApi, usersApiConfig };

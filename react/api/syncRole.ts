/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */

import Api from './Api';

class SyncRolesApi extends Api<SyncRolesApi> {
  get prefix() {
    return '/iam/choerodon/v1/sync_roles_and_permission';
  }

  getStatus() {
    return this.request({
      url: `${this.prefix}/status`,
      method: 'get',
    });
  }

  SyncPermission() {
    return this.request({
      url: this.prefix,
      method: 'put',
    });
  }
}

const syncRolesApi = new SyncRolesApi();
const syncRolesApiConfig = new SyncRolesApi(true);
export { syncRolesApi, syncRolesApiConfig };

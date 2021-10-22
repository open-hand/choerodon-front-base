/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */

import Api from './Api';

class RolesApi extends Api<RolesApi> {
  get prefix() {
    return `/iam/choerodon/v1/projects/${this.projectId}/roles`;
  }

  getRoles(onlySelectEnable: boolean, roleName?: string) {
    return this.request({
      url: this.prefix,
      method: 'get',
      params: {
        only_select_enable: onlySelectEnable,
        role_name: roleName || '',
      },
    });
  }
}

const rolesApi = new RolesApi();
const rolesApiConfig = new RolesApi(true);
export { rolesApi, rolesApiConfig };

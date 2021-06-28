export default class OrgUserApis {
  static getCheckEnableUserApi(orgId: string | number) {
    return `/iam/choerodon/v1/register_saas/check_enable_user?tenantId=${orgId}`;
  }
}

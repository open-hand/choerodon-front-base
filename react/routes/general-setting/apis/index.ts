export default class GeneralSettingApi {
  static getProjectInfo(projectId: number) {
    return `/iam/choerodon/v1/projects/${projectId}`;
  }

  static disableProject(organizationId: number, projectId: number) {
    return `/iam/choerodon/v1/organizations/${organizationId}/projects/${projectId}/disable`;
  }
}

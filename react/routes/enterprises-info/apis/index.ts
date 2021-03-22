export default class EnterprisesApis {
  static getDefaultData(): string {
    return '/iam/choerodon/v1/organizations/default';
  }

  static updateInfo(): string {
    return '/iam/choerodon/v1/enterprises';
  }
}

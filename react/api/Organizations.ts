import Api from './Api';

class OrganizationsApi extends Api<OrganizationsApi> {
  get prefix() {
    return `/iam/choerodon/v1/organizations/${this.orgId}`;
  }

  // choerodon-iam.choerodon-project-user-pro.generateLink
  getLink() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/generate/link`,
    });
  }

  // choerodon-iam.choerodon-project-user-pro.refreshLink
  refreshLink() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/refresh/link`,
    });
  }

  invitation() {
    return this.request({
      method: 'post',
      url: `${this.prefix}/invitation`,
    });
  }

  emailSuffix() {
    return this.request({
      method: 'get',
      url: `${this.prefix}/email_suffix`,
    });
  }
}

const organizationsApi = new OrganizationsApi();
const organizationsApiConfig = new OrganizationsApi(true);
export { organizationsApiConfig, organizationsApi };

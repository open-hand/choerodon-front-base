export default ({ id = 0, organizationId }) => ({
  autoQuery: false,
  selection: 'single',
  paging: false,
  transport: {
    read: {
      url: `/iam/choerodon/v1/projects/${id}/email_suffix?organization_id=${organizationId}`,
      method: 'get',
      transformResponse: (res) => {
        if (res) {
          return {
            emailSuffix: res,
          };
        }
        return {};
      },
    },
  },
});

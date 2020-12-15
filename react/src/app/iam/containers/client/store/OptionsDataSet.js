export default function (orgId, isProject, projectId) {
  return {
    selection: 'multiple',
    transport: {
      read: {
        url: isProject ? `/iam/choerodon/v1/projects/${projectId}/roles?only_select_enable=true&role_name=` : `/iam/choerodon/v1/organizations/${orgId}/role_members/clients/count`,
        method: isProject ? 'get' : 'post',
      },
    },
    autoQuery: true,
  };
}

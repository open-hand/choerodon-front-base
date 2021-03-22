export default function (projectId, applicationId) {
  return {
    autoQuery: true,
    paging: false,
    fields: [
      { name: 'id', type: 'string', label: '版本id' },
      { name: 'applicationId', type: 'string', label: '应用id' },
      { name: 'version', type: 'string', label: '版本名' },
      { name: 'description', type: 'string', label: '版本描述' },
      { name: 'status', type: 'string', label: '版本状态' },
    ],
    transport: {
      read: () => ({
        url: `/iam/choerodon/v1/projects/${projectId}/applications/${applicationId}/versions/brief_info`,
        method: 'get',
      }),
    },
  };
}

import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore() {
  return useLocalStore(() => ({

    loadClientDetail(organizationId, clientId, isProject, projectId) {
      return axios.get(isProject ? `/iam/choerodon/v1/organizations/${organizationId}/clients-project/${projectId}/${clientId}` : `/iam/v1/${organizationId}/clients/${clientId}`);
    },

    async loadClientRoles(organizationId, clientId, isProject, projectId) {
      try {
        const path = isProject ? `/iam/choerodon/v1/organizations/${organizationId}/clients-project/${projectId}/client-roles/${clientId}` : `/iam/hzero/v1/${organizationId}/member-roles/client-roles/${clientId}?memberType=client&page=0&size=0`;
        const res = await axios.get(path);
        if (isProject) {
          if (res) {
            return res;
          }
        } else if (res && res.content) {
          return res.content;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  }));
}

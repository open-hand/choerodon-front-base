import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';
import moment from 'moment';

export default function useStore() {
  return useLocalStore(() => ({
    async hasProgramProjects(organizationId: number, projectId: number) {
      try {
        const res = await axios.get(`/iam/choerodon/v1/organizations/${organizationId}/project_relations/${projectId}/${projectId}`);
        if (res && !res.failed && res.length) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    axiosUpdateWaterfallProjectInfo(data:any) {
      const {
        id, projectCode, projectEstablishmentTime, projectConclusionTime, waterfallData,
      } = data;
      if (!moment.isMoment(projectEstablishmentTime) || !moment.isMoment(projectConclusionTime)) {
        throw new Error({ message: '立项或结项时间错误' });
      }

      return axios.put(`/wfpm/v1/projects/${id}/project_info`, {
        ...waterfallData,
        projectCode,
        projectEstablishmentTime: projectEstablishmentTime.format('YYYY-MM-DD HH:mm:ss'),
        projectConclusionTime: projectConclusionTime.format('YYYY-MM-DD  HH:mm:ss'),
      });
    },

    axiosUpdateAgileProjectInfo(data:any) {
      const {
        id, agileProjectId, agileProjectObjectVersionNumber, agileProjectCode,
      } = data;
      return axios.put(`/agile/v1/projects/${id}/project_info`, {
        infoId: agileProjectId,
        projectCode: agileProjectCode,
        objectVersionNumber: agileProjectObjectVersionNumber,
      });
    },

    axiosUpdateTestProjectInfo(data:any) {
      const {
        projectId, projectCode, testProjectInfoId, testProjectObjectVersionNumber,
      } = data;
      return axios.put(`/test/v1/projects/${projectId}/project_info`, {
        infoId: testProjectInfoId,
        projectCode,
        objectVersionNumber: testProjectObjectVersionNumber,
      });
    },
  }));
}

export type StoreProps = ReturnType<typeof useStore>;

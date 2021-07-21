// @ts-nocheck
import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';
import moment from 'moment';
import { has as hasInject, get as getInject } from '@choerodon/inject';

// eslint-disable-next-line no-undef
const hasBusiness = C7NHasModule('@choerodon/base-business');

export default function useStore() {
  return useLocalStore(() => ({
    isSenior: true,
    get getIsSenior() {
      return this.isSenior;
    },
    setIsSenior(flag) {
      this.isSenior = flag;
    },

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
      return axios.put(`/test/v1/projects/${projectId}/${hasBusiness ? 'bus/' : ''}project_info`, {
        infoId: testProjectInfoId,
        projectCode,
        objectVersionNumber: testProjectObjectVersionNumber,
      });
    },

    async checkSenior(organizationId) {
      if (hasInject('base-saas:checkSaaSSenior')) {
        const res = await getInject('base-saas:checkSaaSSenior')(organizationId);
        console.log('res1', res);
        this.setIsSenior(res);
      } else {
        console.log('res2', res);
        this.setIsSenior(true);
      }
    },
  }));
}

export type StoreProps = ReturnType<typeof useStore>;

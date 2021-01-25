import { action, computed, observable } from 'mobx';
import { axios } from '@choerodon/boot';
import moment from 'moment';

class GeneralSettingStore {
  @observable projectInfo = {};

  @observable projectTypes = [];

  @observable imageUrl = null;

  @action setImageUrl(data) {
    this.imageUrl = data;
  }

  @computed get getImageUrl() {
    return this.imageUrl;
  }

  @action setProjectInfo(data) {
    this.projectInfo = data;
  }

  @computed get getProjectInfo() {
    return this.projectInfo;
  }

  @action setProjectTypes(data) {
    this.projectTypes = data;
  }

  @computed get getProjectTypes() {
    return this.projectTypes;
  }

  axiosGetProjectInfo(id) {
    return axios.get(`/iam/choerodon/v1/projects/${id}`);
  }

  axiosGetProjectInfoOnlyAgile(id) {
    return axios.get(`/agile/v1/projects/${id}/project_info`);
  }

  axiosGetProjectInfoOnlyTest(id) {
    return axios.get(`/test/v1/projects/${id}/project_info`);
  }

  axiosSaveProjectInfo(data) {
    return axios.put(`/iam/choerodon/v1/projects/${data.id}`, data);
  }

  disableProject(proId) {
    return axios.put(`/iam/choerodon/v1/projects/${proId}/disable`);
  }

  axiosGetWaterfallProjectInfo(id) {
    return axios.get(`/wfpm/v1/projects/${id}/project_info`);
  }

  axiosUpdateWaterfallProjectInfo(data) {
    const { id, waterfallData } = this.getProjectInfo;
    const { projectCode, projectEstablishmentTime, projectConclusionTime } = data;
    if (!moment.isMoment(projectEstablishmentTime) || !moment.isMoment(projectConclusionTime)) {
      throw new Error({ message: '立项或结项时间错误' });
    }

    return axios.put(`/wfpm/v1/projects/${id}/project_info`, {
      ...waterfallData,
      projectCode,
      projectEstablishmentTime: projectEstablishmentTime.format('YYYY-MM-DD HH:mm:ss'),
      projectConclusionTime: projectConclusionTime.format('YYYY-MM-DD  HH:mm:ss'),
    });
  }

  axiosUpdateAgileProjectInfo(data) {
    const { id, agileProjectId, agileProjectObjectVersionNumber } = this.getProjectInfo;
    const { agileProjectCode } = data;
    return axios.put(`/agile/v1/projects/${id}/project_info`, {
      infoId: agileProjectId,
      projectCode: agileProjectCode,
      objectVersionNumber: agileProjectObjectVersionNumber,
    });
  }

  axiosUpdateTestProjectInfo(data) {
    const { id, agileProjectObjectVersionNumber } = this.getProjectInfo;
    const { projectCode } = data;
    return axios.put(`/test/v1/projects/${id}/project_info`, {
      infoId: id,
      projectCode,
      // objectVersionNumber: agileProjectObjectVersionNumber,
    });
  }

  loadProjectTypes = () => axios.get('/iam/choerodon/v1/projects/types');
}

export default GeneralSettingStore;

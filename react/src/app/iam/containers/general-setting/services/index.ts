import { axios } from '@choerodon/boot';
import AppPublishApi from '../apis';

export default class GeneralSettingServices {
  static disableProject(organizationId: number, projectId: number) {
    return axios.put(AppPublishApi.disableProject(organizationId, projectId));
  }
}

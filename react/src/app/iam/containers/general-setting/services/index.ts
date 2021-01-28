import { axios } from '@choerodon/boot';
import GeneralSettingApi from '../apis';

export default class GeneralSettingServices {
  static disableProject(organizationId: number, projectId: number) {
    return axios.put(GeneralSettingApi.disableProject(organizationId, projectId));
  }
}

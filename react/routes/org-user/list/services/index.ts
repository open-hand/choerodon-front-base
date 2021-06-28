import { axios } from '@choerodon/boot';
import OrgUserApis from '@/routes/org-user/list/apis';

export default class OrgUserServices {
  static axiosGetCheckEnableUser(orgId: string | number) {
    return axios.get(OrgUserApis.getCheckEnableUserApi(orgId));
  }
}

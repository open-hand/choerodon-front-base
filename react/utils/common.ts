import { stores } from '@choerodon/boot';

const { AppState } = stores;

const getProjectId = () => (AppState.currentMenuType ? AppState.currentMenuType.id : 0);
const getOrganizationId = () => (AppState.currentMenuType
  ? AppState.currentMenuType.organizationId
  : 0);

export {
  getProjectId,
  getOrganizationId,
};

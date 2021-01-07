import { useLocalStore } from 'mobx-react-lite';
import { axios } from '@choerodon/boot';

export default function useStore() {
  return useLocalStore(() => ({
    enableEditCode: false,
    get getEnableEditCode() {
      return this.enableEditCode;
    },
    setEnableEditCode(flag: boolean) {
      this.enableEditCode = flag;
    },

    async checkEnableEditCode() {
      try {
        const res = await axios.get('iam/choerodon/v1/enterprises/default/check_enable_update_tenant_num');
        if (res && !res.failed) {
          this.setEnableEditCode(true);
        }
      } catch (e) {
        //
      }
    },
  }));
}

export type StoreProps = ReturnType<typeof useStore>;

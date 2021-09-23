import React, { createContext, useMemo, useContext } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import UserInfoStoreObject from './UserInfoStore';
import userInfoDsConfig from './userInfoDataSet';
import verifyFormDataSetConfig from './verifyFormDataSet';
import pswModifyPhoneDataSetConfig from './pswModifyPhoneDataSet';
import newPhoneDataSetConfig from './newPhoneDataSet';
import modifyPswFormDataSetConfig from './modifyPswFormDataSet';
import modifyNameDataSetConfig from './modifyNameDataSet';

const Store = createContext();
export function useStore() {
  return useContext(Store);
}
export default Store;

export const StoreProvider = injectIntl(
  inject('AppState')((props) => {
    const {
      AppState: {
        currentMenuType: { type, id, organizationId },
        getUserId: userId,
      },
      intl,
      children,
    } = props;
    const intlPrefix = 'user.userinfo';
    const UserInfoStore = useMemo(() => new UserInfoStoreObject(), []);
    const userInfoDs = useMemo(() => new DataSet(userInfoDsConfig()), [userId]);
    const verifyFormDataSet = useMemo(() => new DataSet(verifyFormDataSetConfig), [userId]);
    const pswModifyPhoneDataSet = useMemo(() => new DataSet(pswModifyPhoneDataSetConfig), [userId]);
    const modifyNameDataSet = useMemo(() => new DataSet(modifyNameDataSetConfig), [userId]);

    const newPhoneDataSet = useMemo(() => new DataSet(newPhoneDataSetConfig), [userId]);
    const modifyPswFormDataSet = useMemo(() => new DataSet(modifyPswFormDataSetConfig), [userId]);

    const value = {
      ...props,
      userId,
      organizationId,
      prefixCls: 'user-info',
      intlPrefix,
      userInfoDs,
      verifyFormDataSet,
      pswModifyPhoneDataSet,
      modifyNameDataSet,
      newPhoneDataSet,
      modifyPswFormDataSet,
      permissions: ['base-service.user.uploadPhoto'],
      UserInfoStore,
    };
    return <Store.Provider value={value}>{children}</Store.Provider>;
  }),
);

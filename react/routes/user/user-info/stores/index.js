import React, { createContext, useMemo, useContext } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import {
  useFormatCommon, useFormatMessage,
} from '@choerodon/master';
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
        currentMenuType: { organizationId },
        getUserId: userId,
      },
      children,
    } = props;
    const intlPrefix = 'c7ncd.user-info';
    const formatClient = useFormatMessage(intlPrefix);
    const formatCommon = useFormatCommon();
    const userInfoDs = useMemo(() => new DataSet(userInfoDsConfig(
      formatClient, formatCommon,
    )), [userId]);
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
    };
    return <Store.Provider value={value}>{children}</Store.Provider>;
  }),
);

import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import FormDataSet from './FormDataSet';
import useStore, { StoreProps } from './useStore';

interface ContextProps {
  prefixCls: string,
  intlPrefix: string,
  formatMessage(arg0: object, arg1?: object): string,
  projectId: number,
  formDs: DataSet,
  scaleList: string[],
  businessTypeList: string[],
  store: StoreProps,
}

const Store = createContext({} as ContextProps);

export function useOpenManagementStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { projectId } },
  } = props;
  const intlPrefix = 'c7ncd.enterprise.info';

  const store = useStore();
  const formDs = useMemo(
    () => new DataSet(FormDataSet({ intlPrefix, formatMessage })), [],
  );

  useEffect(() => {
    store.checkEnableEditCode();
  }, []);

  const value = {
    ...props,
    intlPrefix,
    prefixCls: 'c7ncd-enterprise-info',
    formatMessage,
    scaleList: ['1', '100', '300', '500', '1000', '3000', '5000'],
    businessTypeList: ['制造业', '建筑业', '房地产业', 'IT', '金融保险业', '交通运输业', '零售批发业', '企业商业服务', '科学研究和技术服务业', '其他'],
    projectId,
    formDs,
    store,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));

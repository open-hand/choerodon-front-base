import React, {
  createContext, useMemo, useContext, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { DataSet } from 'choerodon-ui/pro';
import TableDataSet from './TableDataSet';

interface ContextProps {
  prefixCls: string,
  intlPrefix: string,
  formatMessage(arg0: object, arg1?: object): string,
  tableDs: DataSet,
  organizationId?: number,
}

const Store = createContext({} as ContextProps);

export function useAppTemplateStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { type, organizationId: orgId } },
  } = props;

  const organizationId = useMemo(() => (type === 'organization' ? orgId : null), [type, orgId]);

  const tableDs = useMemo(() => new DataSet((TableDataSet({
    organizationId,
  }))), [organizationId]);

  const value = {
    ...props,
    prefixCls: 'c7ncd-template',
    intlPrefix: 'c7ncd.template',
    formatMessage,
    tableDs,
    organizationId,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));

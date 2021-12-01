import React, { createContext, Children, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { useFormatMessage, useFormatCommon } from '@choerodon/master';
import SystemSettingDataSet from './SystemSettingDataSet';

const Store = createContext();
export default Store;

export const StoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const { AppState: { currentMenuType: { id, type, organizationId } }, children, intl } = props;
    const intlPrefix = 'c7n.safe';
    const format = useFormatMessage(intlPrefix);
    const formatCommon = useFormatCommon();
    const orgId = type === 'organization' ? id : organizationId;
    const systemSettingDataSet = useMemo(() => new DataSet(SystemSettingDataSet({
      id: orgId, intlPrefix, format, formatCommon,
    })), [orgId]);
    const value = {
      orgId,
      id,
      systemSettingDataSet,
      intl,
      intlPrefix,
      format,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

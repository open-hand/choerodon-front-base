import React, { createContext, useContext } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { useFormatMessage, useFormatCommon } from '@choerodon/master';
import useStore from './useStore';

const Store = createContext();

export function useEmailSendStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
  } = props;

  const EmailSendStore = useStore();
  const intlPrefix = 'c7n.platform.emailSend';
  const format = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();
  const value = {
    ...props,
    EmailSendStore,
    intlPrefix,
    format,
    formatCommon,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

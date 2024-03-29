import React, { createContext, useContext } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import useStore from './useStore';

const Store = createContext();

export function usePlatformPeopleStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')(observer((props) => {
  const {
    children,
  } = props;

  const PlatformPeopleStore = useStore();
  const intlPrefix = 'c7n.platform.peopleStore';
  const value = {
    ...props,
    PlatformPeopleStore,
    intlPrefix,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

import React, { createContext } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';

const Store = createContext();

export default Store;

export const StoreProvider = injectIntl(inject('AppState')(
  (props) => {
    const { AppState: { currentMenuType: { id, organizationId } }, children } = props;
    const intlPrefix = 'organization.user.sider';

    const value = {
      ...props,
      prefixCls: 'base-project-user-sider',
      intlPrefix,
      projectId: id,
      organizationId,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
));

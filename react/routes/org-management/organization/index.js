import React from 'react';
import { asyncRouter } from '@choerodon/boot';
import Store from '../stores';

const Organization = asyncRouter(
  () => import('./Organization'),
  () => import('../../../stores/global/organization'),
);

const Index = () => (
  <Store.Consumer>
    {({
      AppState, HeaderStore, intl, organizationDataSet,
    }) => (
      <Organization
        intl={intl}
        AppState={AppState}
        HeaderStore={HeaderStore}
        organizationDataSet={organizationDataSet}
      />
    )}
  </Store.Consumer>
);

export default Index;

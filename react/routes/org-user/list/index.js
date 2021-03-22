import React from 'react/index';
import { StoreProvider } from './stores';
import ListView from './ListView.js';

export default props => (
  <StoreProvider {...props}>
    <ListView />
  </StoreProvider>
);

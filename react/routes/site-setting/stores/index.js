import React, { createContext } from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { DataSet } from 'choerodon-ui/pro';
import SystemSettingDataSet from './SystemSettingDataSet';
import funcModeDataSet from './FuncModeDataSet';

// eslint-disable-next-line no-undef
const hasRegister = C7NHasModule('@choerodon/base-pro');

const Store = createContext();
export default Store;

export const StoreProvider = injectIntl(inject('AppState')((props) => {
  const { children, AppState: { currentMenuType: { id: orgId } } } = props;
  const systemSettingDataSet = new DataSet(SystemSettingDataSet({ id: orgId, hasRegister }));
  const FuncModeDataSet = new DataSet(funcModeDataSet());
  const intlPrefix = 'global.system-setting';
  // map first color to second color
  const colorMap = {
    '#e50113': '#d20112',
    '#ef7c0a': '#e4770b',
    '#cb8347': '#bf783a',
    '#40886c': '#337d60',
    '#478384': '#387475',
    '#3b5a97': '#2d4a85',
    '#1a73e8': '#3367d6',
    '#3f51b5': '#303f9f',
  };
  const presetColors = Object.keys(colorMap);
  const value = {
    ...props,
    orgId,
    systemSettingDataSet,
    FuncModeDataSet,
    intlPrefix,
    presetColors,
    colorMap,
    hasRegister,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));

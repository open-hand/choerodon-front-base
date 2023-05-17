import { StoreProps } from './stores/useStore';
import { IntlFormatters } from 'react-intl';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { DataSet } from 'choerodon-ui/pro';

export type ModifyStepClassIndexProps = {
  isEdit:boolean|undefined;
  record:Record|undefined;
  stepClassManagementDs:DataSet;
};

export type ModifyStepClassStoreContext = {
  prefixCls: 'c7ncd-modify-step-class'
  intlPrefix: 'c7ncd.modify.step.class'
  mainStore: StoreProps
  formatModifyStepClass: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & ModifyStepClassIndexProps;

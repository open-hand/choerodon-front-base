import { StoreProps } from './stores/useStore';
import { IntlFormatters } from 'react-intl'

export type StepClassManageIndexProps = {
};

export type StepClassManageStoreContext = {
  prefixCls: 'c7ncd-step-class-manage'
  intlPrefix: 'c7ncd.step.class.manage'
  mainStore: StoreProps
  formatStepClassManage: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & StepClassManageIndexProps;

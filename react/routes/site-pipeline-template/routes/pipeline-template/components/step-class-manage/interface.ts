import { StoreProps } from './stores/useStore';
import { IntlFormatters } from 'react-intl'

export type StepClassManageIndexProps = {
};

export type StepClassManageStoreContext = {
  prefixCls: 'c7ncd-step-class-manage'
  intlPrefix: 'c7ncd.step.class.manage'
  mainStore: StoreProps
  formatStepClassManage: any,
  formatCommon: any,
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & StepClassManageIndexProps;

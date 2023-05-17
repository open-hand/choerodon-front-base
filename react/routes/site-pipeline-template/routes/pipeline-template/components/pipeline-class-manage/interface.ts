import { IntlFormatters } from 'react-intl';
import { StoreProps } from './stores/useStore';

export type PipelineClassManageIndexProps = {
  handleEdit:(id:string)=>void
};

export type PipelineClassManageStoreContext = {
  prefixCls: 'c7ncd-pipeline-class-manage'
  intlPrefix: 'c7ncd.pipeline.class.manage'
  mainStore: StoreProps
  formatPipelineClassManage: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & PipelineClassManageIndexProps;

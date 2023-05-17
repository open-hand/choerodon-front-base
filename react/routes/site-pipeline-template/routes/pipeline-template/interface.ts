import { IntlFormatters } from 'react-intl';
import { StoreProps } from './stores/useStore';

export type PipelineTemplateIndexProps = {
};

export type PipelineTemplateStoreContext = {
  prefixCls: 'c7ncd-pipeline-template'
  intlPrefix: 'c7ncd.pipeline.template'
  mainStore: StoreProps
  formatPipelineTemplate: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & PipelineTemplateIndexProps;

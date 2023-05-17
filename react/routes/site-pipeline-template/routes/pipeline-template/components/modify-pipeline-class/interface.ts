import { StoreProps } from './stores/useStore';
import { IntlFormatters } from 'react-intl';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { DataSet } from 'choerodon-ui/pro';

export type ModifyPipelineClassIndexProps = {
  isEdit:boolean|undefined;
  record:Record|undefined;
  pipelineClassManagementDs:DataSet;
};

export type ModifyPipelineClassStoreContext = {
  prefixCls: 'c7ncd-modify-pipeline-class'
  intlPrefix: 'c7ncd.modify.pipeline.class'
  mainStore: StoreProps
  formatModifyPipelineClass: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & ModifyPipelineClassIndexProps;

import { StoreProps } from './stores/useStore';
import { IntlFormatters } from 'react-intl';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import { DataSet } from 'choerodon-ui/pro';

export type ModifyTaskGroupIndexProps = {
  isEdit:boolean|undefined;
  record:Record|undefined;
  taskGoupManagementDs:DataSet;
};

export type ModifyTaskGroupStoreContext = {
  prefixCls: 'c7ncd-modify-task-group'
  intlPrefix: 'c7ncd.modify.task.group'
  mainStore: StoreProps,
  formatModifyTaskGroup: IntlFormatters['formatMessage'],
  formatCommon: IntlFormatters['formatMessage'],
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & ModifyTaskGroupIndexProps;

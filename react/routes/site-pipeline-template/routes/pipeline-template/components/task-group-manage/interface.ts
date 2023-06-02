import { StoreProps } from './stores/useStore';
import { IntlFormatters } from 'react-intl'

export type TaskGroupManageIndexProps = {
};

export type TaskGroupManageStoreContext = {
  prefixCls: 'c7ncd-task-group-manage'
  intlPrefix: 'c7ncd.task.group.manage'
  mainStore: StoreProps
  formatTaskGroupManage: any,
  formatCommon: any,
} & ProviderProps;

export type ProviderProps = {
  [fields:string]:any
} & TaskGroupManageIndexProps;

import { DataSetProps } from 'choerodon-ui/pro/lib/data-set/DataSet';
import { FieldType, DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
// pro btn 的颜色和类型的枚举
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
// Form label labellayout的枚举类型
import { LabelLayoutType, LabelAlignType } from 'choerodon-ui/pro/lib/form/Form';

// 大小枚举
import { Size } from 'choerodon-ui/lib/_util/enum';
// textArea resize属性
import { ResizeType } from 'choerodon-ui/pro/lib/text-area/enum';
// progress type
import { ProgressType, ProgressStatus } from 'choerodon-ui/lib/progress/enum';
// queryBar
import { TableQueryBarType, ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { TableQueryBarHook } from 'choerodon-ui/pro/lib/table/Table';
// placement
import { Placements } from 'choerodon-ui/pro/lib/dropdown/enum';
// Action trigger
import { Action } from 'choerodon-ui/pro/lib/trigger/enum';

// Upload File
import { UploadFile } from 'choerodon-ui/lib/upload/interface';

interface RecordObjectProps {
  record: Record;
}

interface ActionProps {
  service?: string[],
  text: string,
  action(): void,
}

export {
  DataSetProps,
  FieldType,
  Record,
  ButtonColor,
  FuncType,
  LabelLayoutType,
  Placements,
  Action as TriggerAction,
  Size,
  ResizeType,
  ProgressType,
  TableQueryBarType,
  TableQueryBarHook,
  DataSetSelection,
  UploadFile,
  LabelAlignType,
  ProgressStatus,
  ColumnAlign,
  RecordObjectProps,
  ActionProps,
};

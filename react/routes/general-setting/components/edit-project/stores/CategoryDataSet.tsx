/* eslint-disable no-param-reassign */

import { DataSet } from 'choerodon-ui/pro';
import { StoreProps } from '@/routes/general-setting/components/edit-project/stores/useStore';
import { CategoryCodesProps } from './index';
import { DataSetProps, DataSetSelection, Record } from '../../../../../interface';

interface DsProps {
  organizationId: number,
  categoryCodes: CategoryCodesProps
  editProjectStore: StoreProps,
}

interface SelectProps {
  dataSet: DataSet,
  record: Record,
}

interface DisableProps extends SelectProps{
  categoryCodes: CategoryCodesProps,
  isSelected: boolean,
  editProjectStore: StoreProps,
}

interface RequireProps {
  dataSet: DataSet,
  categoryCodes: CategoryCodesProps,
  selected: boolean,
}

function handleDisabled({
  dataSet, record, categoryCodes, isSelected, editProjectStore,
}: DisableProps) {
  const isSenior = editProjectStore.getIsSenior;
  if (!isSenior) {
    return;
  }
  if (record.get('code') === categoryCodes.agile) {
    if (!record.getState('isAgile')) {
      const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.program);
      findRecord && findRecord.setState('disabled', isSelected);
    }
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
  if (record.get('code') === categoryCodes.program) {
    if (!record.getState('isProgram')) {
      const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.agile);
      findRecord && findRecord.setState('disabled', isSelected);
    }
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
}

function setRequireModule({ dataSet, selected, categoryCodes }: RequireProps) {
  const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.require);
  if (!findRecord) {
    return;
  }
  if (selected) {
    findRecord.setState('disabled', false);
    if (findRecord.getState('isRequire') && !findRecord.getState('isEdit')) {
      dataSet.select(findRecord);
    }
  } else {
    const codeArr = [categoryCodes.agile, categoryCodes.program];
    const hasSelected = dataSet.some((eachRecord) => (codeArr.includes(eachRecord.get('code')) && eachRecord.isSelected));
    if (!hasSelected) {
      dataSet.unSelect(findRecord);
    }
    findRecord.setState('disabled', !hasSelected);
  }
}

export default ({ organizationId, categoryCodes, editProjectStore }: DsProps): DataSetProps => ({
  autoCreate: false,
  autoQuery: false,
  selection: 'multiple' as DataSetSelection,
  paging: false,
  transport: {
    read: {
      url: organizationId ? `iam/v1/organizations/${organizationId}/project_categories` : '',
      method: 'get',
    },
  },
  events: {
    select: ({ dataSet, record }: SelectProps) => {
      record.isSelected = true;
      handleDisabled({
        dataSet, record, categoryCodes, isSelected: true, editProjectStore,
      });
    },
    unSelect: ({ dataSet, record }: SelectProps) => {
      record.isSelected = false;
      handleDisabled({
        dataSet, record, categoryCodes, isSelected: false, editProjectStore,
      });
    },
  },
});

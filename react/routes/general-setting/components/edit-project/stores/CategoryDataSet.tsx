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

  if (
    [
      categoryCodes.program,
      categoryCodes.agile,
      categoryCodes.waterfall,
    ].indexOf(record.get('code')) !== -1
  ) {
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
    const agileRecord = dataSet.find(
      (eachRecord) => eachRecord.get('code') === categoryCodes.agile,
    );
    const programRecord = dataSet.find(
      (eachRecord) => eachRecord.get('code') === categoryCodes.program,
    );
    const waterfallRecord = dataSet.find(
      (eachRecord) => eachRecord.get('code') === categoryCodes.waterfall,
    );
    if (record === agileRecord || record === programRecord) {
      // @ts-ignore
      const agileOrProgramSelectedNum = agileRecord?.isSelected + programRecord?.isSelected;
      if (!isSelected && agileOrProgramSelectedNum === 1) {
        return;
      }
      waterfallRecord?.setState('disabled', isSelected);
    }
    // 修改项目之前是 敏捷或项目群 不能选瀑布
    // 修改项目之前是瀑布 不能再选敏捷和项目群
    if (record === waterfallRecord) {
      agileRecord?.setState('disabled', isSelected);
      programRecord?.setState('disabled', isSelected);
    }
    const bool = dataSet.getState('isAgile') || dataSet.getState('isProgram');
    const isEdit = dataSet.getState('isEdit');
    if (isEdit && bool) {
      waterfallRecord?.setState('disabled', true);
    }
    if (isEdit && record === waterfallRecord) {
      agileRecord?.setState('disabled', true);
      programRecord?.setState('disabled', true);
    }
  }

  // 创建项目时可以同时选择项目群和敏捷管理
  // 修改项目时项目群可以加上敏捷，敏捷不能加上项目群
  // 原项目是加过项目群后不能改成单独一个敏捷的类型
  if (record.get('code') === categoryCodes.agile) {
    setRequireModule({ dataSet, selected: isSelected, categoryCodes });
  }
  if (record.get('code') === categoryCodes.program) {
    if (dataSet.getState('isBeforeProgram')) {
      const findRecord = dataSet.find((eachRecord) => eachRecord.get('code') === categoryCodes.agile);
      findRecord && findRecord.setState('disabled', !isSelected);
      if (!isSelected && findRecord?.isSelected) {
        findRecord.isSelected = false;
      }
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
    const codeArr = [categoryCodes.agile, categoryCodes.program, categoryCodes.waterfall];
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

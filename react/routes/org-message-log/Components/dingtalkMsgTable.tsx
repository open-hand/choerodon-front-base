import React, { } from 'react';
import { Action } from '@choerodon/master';
import { StatusTag } from '@choerodon/components';
import { Table, Modal } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  CONSTANTS,
} from '@choerodon/boot';
import { TableQueryBarType, TableColumnTooltip } from 'choerodon-ui/pro/lib/table/enum';
import { useStore } from '../stores';

const { Column } = Table;

const modalKey = Modal.key();

const {
  MODAL_WIDTH: {
    MIDDLE,
  },
} = CONSTANTS;

const TableIndex = () => {
  const {
    prefixCls,
    intlPrefix,
    dingtalkMsgTableDs,
  } = useStore();

  const renderAction = ({ text, record }: {text:string, record:Record}) => {
    const actionDatas = [
      {
        service: [],
        text: '禁用',
        // action: () => { handleDisable(record.get('id')); },
      },
    ];

    return <Action data={actionDatas} />;
  };

  const renderStatusTag = ({ value }: { value: boolean }) => (
    <StatusTag
      colorCode={value ? 'success' : 'lost'}
      name={value ? '启用' : '停用'}
    />
  );

  const renderType = ({ value }: { value: string }) => <span>{value}</span>;

  return (
    <Table pristine dataSet={dingtalkMsgTableDs} border={false} queryBar={'bar' as TableQueryBarType}>
      <Column name="a" tooltip={'overflow' as TableColumnTooltip} />
      <Column width={60} renderer={renderAction} />
      <Column name="b" renderer={renderStatusTag} tooltip={'overflow' as TableColumnTooltip} />
      <Column name="c" renderer={renderType} tooltip={'overflow' as TableColumnTooltip} />
      <Column name="d" tooltip={'overflow' as TableColumnTooltip} />
      <Column name="e" tooltip={'overflow' as TableColumnTooltip} />
      <Column name="f" tooltip={'overflow' as TableColumnTooltip} />
      <Column name="g" tooltip={'overflow' as TableColumnTooltip} />
    </Table>
  );
};

export default observer(TableIndex);

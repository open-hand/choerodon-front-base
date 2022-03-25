import React, { useMemo } from 'react';
import {
  CONSTANTS,
} from '@choerodon/boot';
import {
  Table, Modal, DataSet,
} from 'choerodon-ui/pro';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import TableListDataset from './tableListDataSet';
import ErrorPage from './error';
import './index.less';

const {
  MODAL_WIDTH: {
    MIDDLE,
  },
} = CONSTANTS;

const { Column } = Table;

export interface Props {
  recordData: Record
}

const PageIndex:React.FC<Props> = (props) => {
  const { recordData } = props;

  const tableDs = useMemo(() => {
    const ds = new DataSet(TableListDataset({ id: recordData.get('id') }));
    return ds;
  }, []);

  const handleErrorClick = (record:Record) => {
    if (!record.get('syncStatusFlag')) {
      return;
    }
    Modal.open({
      title: '失败详情',
      children: <ErrorPage historyId={record.get('id')} />,
      drawer: true,
      style: { width: MIDDLE },
      okCancel: false,
      okText: '关闭',
    });
  };

  const renderSyncBeginTime = ({ value, record }: {value:string, record: Record}) => (
    <span
      role="none"
      className={record?.get('syncStatusFlag') ? 'sync-record-error' : ''}
      onClick={() => {
        handleErrorClick(record);
      }}
    >
      {value}
    </span>
  );

  return (
    <div className="sync-record-dingTalk">
      <Table
        dataSet={tableDs}
        queryBar={'none' as any}
      >
        <Column renderer={renderSyncBeginTime} name="syncBeginTime" />
        <Column className="text-gray" name="updateUserCount" />
        <Column className="text-gray" name="errorUserCount" />
        <Column className="text-gray" name="syncEndTime" />
      </Table>
    </div>
  );
};

export default PageIndex;

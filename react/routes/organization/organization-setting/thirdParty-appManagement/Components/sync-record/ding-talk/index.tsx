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

}

const PageIndex:React.FC<Props> = () => {
  const tableDs = useMemo(() => {
    const ds = new DataSet(TableListDataset({}));
    return ds;
  }, []);

  const handleErrorClick = () => {
    console.log(8989);
    Modal.open({
      title: '失败详情',
      children: <ErrorPage />,
      drawer: true,
      style: { width: MIDDLE },
      okCancel: false,
      okText: '关闭',
    });
  };

  const renderSyncBeginTime = ({ value, record }: {value:string, record: Record}) => {
    console.log(123);
    return (
      <span role="none" onClick={handleErrorClick}>{value}</span>
    );
  };

  return (
    <div className="sync-record-dingTalk">
      <Table
        dataSet={tableDs}
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

import React, { useMemo } from 'react';
import {
  Table, DataSet,
} from 'choerodon-ui/pro';
import ErrorListDataSet from './errorListDataSet';

const { Column } = Table;

export interface Props {

}

const PageIndex:React.FC<Props> = () => {
  const tableDs = useMemo(() => {
    const ds = new DataSet(ErrorListDataSet({}));
    return ds;
  }, []);

  return (
    <div className="sync-record-dingTalk-error">
      <Table
        dataSet={tableDs}
      >
        <Column name="loginName" />
        <Column name="email" />
        <Column name="name" />
        <Column name="phone" />
        <Column name="cause" />
      </Table>
    </div>
  );
};

export default PageIndex;

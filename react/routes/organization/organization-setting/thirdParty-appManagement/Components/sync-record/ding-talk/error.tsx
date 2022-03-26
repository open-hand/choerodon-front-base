import React, { useMemo } from 'react';
import {
  Table, DataSet,
} from 'choerodon-ui/pro';
import ErrorListDataSet from './errorListDataSet';

const { Column } = Table;

export interface Props {
  historyId: string
}

const PageIndex:React.FC<Props> = (props) => {
  const { historyId } = props;
  const tableDs = useMemo(() => {
    const ds = new DataSet(ErrorListDataSet({ historyId }));
    return ds;
  }, []);

  return (
    <div className="sync-record-dingTalk-error">
      <Table
        dataSet={tableDs}
      >
        <Column name="loginName" tooltip={'overflow' as any} />
        <Column name="email" tooltip={'overflow' as any} />
        <Column name="name" tooltip={'overflow' as any} />
        <Column name="phone" tooltip={'overflow' as any} />
        <Column name="cause" tooltip={'overflow' as any} />
      </Table>
    </div>
  );
};

export default PageIndex;

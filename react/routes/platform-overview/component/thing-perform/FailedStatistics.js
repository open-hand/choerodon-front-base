/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Table } from 'choerodon-ui/pro';
import { withRouter } from 'react-router-dom';

import { Tooltip } from 'choerodon-ui/pro';
import { useFailedStatisticsStore } from './stores';

const { Column } = Table;

const FailedStatistics = withRouter(observer((props) => {
  const {
    history,
    location: {
      search,
    },
  } = props;

  const {
    FailedStatisticsTableDataSet,
  } = useFailedStatisticsStore();

  const handleClickSagaRecord = (record) => {
    history.push(`/asgard/saga-instance${search}&sagaCode=${record.get('sagaCode')}-${record.get('id')}`);
  };

  const renderSagaCode = ({ value, record }) => (
    <Tooltip title={`${value}-${record.get('viewId')}`}>
      <a className="c7n-overview-sage" onClick={() => handleClickSagaRecord(record)}>{`${value}-${record.get('viewId')}`}</a>
    </Tooltip>
  );

  return (
    <div className="c7n-overview-failedStatistics">
      <span className="c7n-overview-failedStatistics-titlespan">失败事务统计</span>
      <Table
        className="c7n-overview-failedStatistics-table"
        dataSet={FailedStatisticsTableDataSet}
        queryBar="none"
      >
        <Column name="sagaCode" renderer={renderSagaCode} />
        <Column name="refType" style={{ color: 'rgba(0,0,0,.65)' }} />
        <Column name="startTime" style={{ color: 'rgba(0,0,0,.65)' }} />
      </Table>
    </div>
  );
}));

export default FailedStatistics;

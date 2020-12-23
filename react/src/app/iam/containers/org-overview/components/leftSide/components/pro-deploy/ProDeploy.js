import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Select, Tooltip } from 'choerodon-ui/pro';
import ContainerBlock from '../../../ContainerBlock';
import { useProDeployStore } from './stores';
import MaxTagPopover from '../../../../../../components/MaxTagPopover';
import Chart from './Chart';

import './index.less';

const { Option } = Select;

const ProDeploy = observer(() => {
  const {
    ProDeployStore: { loading, ...ProDeployStore },
    AppState: {
      menuType: { orgId },
    },
    ProDeploySelectDataSet,
  } = useProDeployStore();

  const handleChangeDays = (days) => {
    ProDeployStore.setChosenDay(days);
    ProDeployStore.initData(orgId, ProDeploySelectDataSet.current.get('proSelect'));
  };

  const SelectProList = () => (
    <Select
      dataSet={ProDeploySelectDataSet}
      name="proSelect"
      searchable
      popupCls="proDeploy-select-dropdown"
      maxTagCount={1}
      searchMatcher="name"
      optionRenderer={({ text }) => <Tooltip title={text}>{text}</Tooltip>}
      maxTagPlaceholder={
        (omittedValues) => (
          <MaxTagPopover
            dataSource={ProDeployStore.projectsArray}
            value={omittedValues}
          />
        )
}
    />
  );

  return (
    <div className="c7n-overview-prodeploy">
      <ContainerBlock
        width="100%"
        height={306}
        title="项目部署情况"
        hasDaysPicker
        titleExtra={SelectProList()}
        handleChangeDays={handleChangeDays}
        loading={loading}
      >
        <Chart />
      </ContainerBlock>
    </div>
  );
});

export default ProDeploy;

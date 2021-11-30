import React from 'react';
import { observer } from 'mobx-react-lite';
import { message, Select, Tooltip } from 'choerodon-ui/pro';
import ContainerBlock from '../../../ContainerBlock';
import { useProDeployStore } from './stores';
import MaxTagPopover from '../../../../../../components/MaxTagPopover';
import Chart from './Chart';
import { useOrgOverview } from '@/routes/org-overview/stores';

import './index.less';

const ProDeploy = observer(() => {
  const {
    ProDeployStore: { loading, ...ProDeployStore },
    AppState: {
      menuType: { orgId },
    },
    ProDeploySelectDataSet,
  } = useProDeployStore();

  const {
    formatClient,
  } = useOrgOverview();

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
      reverse={false}
      onChange={(value) => {
        if (value && value.length && value.length > 4) {
          message.error('最多选择4个项目');
          value.pop();
          ProDeploySelectDataSet.current.set('proSelect', value);
        }
      }}
      // onOption={({ record }) => ({
      //   disabled: ProDeploySelectDataSet.current.get('proSelect').length === 4
      //         && !ProDeploySelectDataSet.current.get('proSelect').includes(record.get('id')),
      // })}
      // ({
      //   disabled: ProDeploySelectDataSet.current.get('proSelect').length === 4 && ,
      // })
      optionRenderer={({ text }) => (
        <Tooltip
          title={text}
        >
          {text}
        </Tooltip>
      )}
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
        title={formatClient({ id: 'deployment' })}
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

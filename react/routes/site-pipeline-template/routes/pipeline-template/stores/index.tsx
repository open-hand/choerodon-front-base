/* eslint-disable max-len */
import React, { createContext, useContext, useMemo } from 'react';
import { inject } from 'mobx-react';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import { DataSet } from 'choerodon-ui/pro';
import { DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import { useLocation, useHistory } from 'react-router';
import useStore from './useStore';
import { PipelineTemplateStoreContext, ProviderProps } from '../interface';
import pipelineTemplateDataSet from './pipelineTemplateDataSet';
import taskTemplateDataSet from './taskTemplateDataSet';
import stepTemplateDataset from './stepTemplateDataSet';

const Store = createContext({} as PipelineTemplateStoreContext);

export function usePipelineTemplateStore() {
  return useContext(Store);
}

export const StoreProvider = inject('AppState')((props: ProviderProps) => {
  const {
    children,
  } = props;

  const prefixCls = 'c7ncd-pipeline-template' as const;
  const intlPrefix = 'c7ncd.pipeline.template' as const;

  const formatCommon = useFormatCommon();
  const formatPipelineTemplate = useFormatMessage(intlPrefix);

  const sourceDs = useMemo(() => new DataSet({
    data: [{
      text: formatPipelineTemplate({ id: 'predefined' }),
      value: 'true',
    }, {
      text: formatPipelineTemplate({ id: 'custom' }),
      value: 'false',
    }],
    selection: 'single' as DataSetSelection,
  }), []);

  const enableDs = useMemo(() => new DataSet({
    data: [{
      text: formatCommon({ id: 'enable' }),
      value: 'true',
    }, {
      text: formatCommon({ id: 'stop' }),
      value: 'false',
    }],
    selection: 'single' as DataSetSelection,
  }), []);
  const pipelineTempaleDs = useMemo(() => new DataSet(pipelineTemplateDataSet({
    formatPipelineTemplate, formatCommon, sourceDs, enableDs,
  })), []);
  const taskTemplateDs = useMemo(() => new DataSet(taskTemplateDataSet({
    formatPipelineTemplate, formatCommon, sourceDs,
  })), []);
  const stepTemplateDs = useMemo(() => new DataSet(stepTemplateDataset({
    formatPipelineTemplate, formatCommon, sourceDs,
  })), []);
  const mainStore = useStore();
  function refresh() {
    pipelineTempaleDs.query();
  }
  function taskTemplateRefresh() {
    taskTemplateDs.query();
  }
  function stepTemplateRefresh() {
    stepTemplateDs.query();
  }
  const history = useHistory();
  const { search, pathname } = useLocation();
  const handleEdit = (tempId: string) => { // 编辑
    history.push({
      pathname: `${pathname}/edit/edit/${tempId}`,
      search,
      state: { id: tempId },
    });
  };
  const handleCreate = () => {
    history.push({
      pathname: `${pathname}/edit/create/default`,
      search,
    });
  };
  const basedOnTempCreate = (tempId: any) => {
    history.push({
      pathname: `${pathname}/edit/create/${tempId}`,
      search,
    });
  };
  const value = {
    ...props,
    mainStore,
    prefixCls,
    intlPrefix,
    formatPipelineTemplate,
    formatCommon,
    pipelineTempaleDs,
    taskTemplateDs,
    taskTemplateRefresh,
    refresh,
    stepTemplateRefresh,
    stepTemplateDs,
    handleEdit,
    handleCreate,
    basedOnTempCreate,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
});

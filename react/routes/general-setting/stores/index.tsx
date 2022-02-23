import React, {
  createContext, useContext, useMemo, useEffect, useCallback,
} from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {
  axios, Choerodon, useFormatMessage, useFormatCommon,
} from '@choerodon/master';
import {
  map, intersection, isEmpty, assign,
} from 'lodash';
import { DataSet } from 'choerodon-ui/pro';
import MainStore from './GeneralSettingStore';
import GeneralSettingDataSet from './GeneralSettingDataSet';

interface ContextProps {
  prefixCls: string,
  intlPrefix: string,
  projectId: number,
  store: any,
  infoDs: DataSet
  loadProject(): void,
  showProjectPrefixArr: string[],
  isShowAgilePrefix: boolean,
  isShowTestPrefix: boolean,
  isWATERFALL: boolean,
  history: any,
  intl: { formatMessage(arg0: object, arg1?: object): string },
}

const Store = createContext({} as ContextProps);

export function useGeneralSettingContent() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    AppState: {
      currentMenuType: {
        projectId, categories,
      },
    },
    intl: { formatMessage },
  } = props;

  const intlPrefix = 'c7ncd.project.setting.info';

  const store = useMemo(() => new MainStore(), []); // 防止update时创建多次store
  const infoDs = useMemo(
    () => new DataSet(GeneralSettingDataSet({ intlPrefix, formatMessage, projectId })), [projectId],
  );
  const projectCategoryCodes = useMemo(() => map(categories || [], 'code'), [categories]);
  const showProjectPrefixArr = useMemo(() => intersection(projectCategoryCodes || [], ['N_AGILE', 'N_PROGRAM', 'N_TEST', 'N_WATERFALL']), [projectCategoryCodes]);
  const isShowAgilePrefix = useMemo(() => !isEmpty(intersection(projectCategoryCodes || [], ['N_AGILE', 'N_PROGRAM', 'N_WATERFALL'])), [projectCategoryCodes]);
  const isShowTestPrefix = useMemo(() => showProjectPrefixArr.includes('N_TEST'), [showProjectPrefixArr]);
  const isWATERFALL = useMemo(() => (projectCategoryCodes || []).includes('N_WATERFALL'), [projectCategoryCodes]);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = useCallback(async () => {
    try {
      const [infoData, agileData = {}, testData = {}] = await axios.all([
        infoDs.query(),
        // isWATERFALL ? store.axiosGetWaterfallProjectInfo(projectId) : undefined,
        isShowAgilePrefix ? store.axiosGetProjectInfoOnlyAgile(projectId) : undefined,
        isShowTestPrefix ? store.axiosGetProjectInfoOnlyTest(projectId)
          : undefined,
      ]);
      infoDs.loadData([assign(infoData, {
        agileProjectCode: agileData.projectCode,
        // waterfallData: waterfallData || {},
        testProjectCode: testData.projectCode,
        testProjectInfoId: testData.infoId,
        testProjectObjectVersionNumber: testData.objectVersionNumber,
        agileProjectObjectVersionNumber: agileData.objectVersionNumber,
      })]);
    } catch (e) {
      Choerodon.handleResponseError(e);
    }
  }, [projectId, isWATERFALL, isShowAgilePrefix, isShowTestPrefix]);

  const formatProjectInfo = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();

  const value = {
    ...props,
    prefixCls: 'c7n-iam-generalsetting',
    intlPrefix,
    infoDs,
    formatProjectInfo,
    formatCommon,
    store,
    loadProject,
    showProjectPrefixArr,
    isShowAgilePrefix,
    isShowTestPrefix,
    isWATERFALL,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

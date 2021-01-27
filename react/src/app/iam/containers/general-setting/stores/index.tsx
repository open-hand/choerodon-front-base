import React, {
  createContext, useContext, useMemo, useEffect, useCallback,
} from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { axios, Choerodon } from '@choerodon/boot';
import { map, intersection, isEmpty } from 'lodash';
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

  const intlPrefix = 'project.info';

  const store = useMemo(() => new MainStore(), []); // 防止update时创建多次store
  const infoDs = useMemo(
    () => new DataSet(GeneralSettingDataSet({ intlPrefix, formatMessage, projectId })), [projectId],
  );
  const projectCategoryCodes = useMemo(() => map(categories || [], 'code'), [categories]);
  const showProjectPrefixArr = useMemo(() => intersection(projectCategoryCodes || [], ['N_AGILE', 'N_PROGRAM', 'N_TEST', 'N_WATERFALL']), [projectCategoryCodes]);
  const isShowAgilePrefix = useMemo(() => !isEmpty(intersection(projectCategoryCodes || [], ['N_AGILE', 'N_PROGRAM'])), [projectCategoryCodes]);
  const isShowTestPrefix = useMemo(() => showProjectPrefixArr.includes('N_TEST'), [showProjectPrefixArr]);
  const isWATERFALL = useMemo(() => (projectCategoryCodes || []).includes('N_WATERFALL'), [projectCategoryCodes]);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = useCallback(async () => {
    try {
      const [, waterfallData, agileData = {}, testData = {}] = await axios.all([
        infoDs.query(),
        isWATERFALL ? store.axiosGetWaterfallProjectInfo(projectId) : undefined,
        isShowAgilePrefix ? store.axiosGetProjectInfoOnlyAgile(projectId) : undefined,
        isShowTestPrefix ? store.axiosGetProjectInfoOnlyTest(projectId)
          : undefined,
      ]);
      const record = infoDs.current;
      if (record) {
        record.init({
          agileProjectCode: agileData.projectCode,
          waterfallData: waterfallData || {},
          testProjectCode: testData.projectCode,
          agileProjectObjectVersionNumber: agileData.objectVersionNumber,
        });
      }
    } catch (e) {
      Choerodon.handleResponseError(e);
    }
  }, [projectId]);

  const value = {
    ...props,
    prefixCls: 'c7n-iam-generalsetting',
    intlPrefix,
    infoDs,
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

import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { forEach, some } from 'lodash';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import FormDataSet from './FormDataSet';
import CategoryDataSet from './CategoryDataSet';
import useStore, { StoreProps } from './useStore';

interface ContextProps {
  AppState: any,
  intl: { formatMessage(arg0: object): string },
  prefixCls: string,
  intlPrefix: string,
  categoryCodes: CategoryCodesProps,
  organizationId: number,
  formDs: DataSet,
  categoryDs: DataSet,
  editProjectStore: StoreProps,
  showProjectPrefixArr: string[],
  isShowAgilePrefix: boolean,
  isShowTestPrefix: boolean,
  isWATERFALL: boolean,
  projectId: number,
  modal: any,
  refresh(): void,
}

export interface CategoryCodesProps {
  devops: string,
  agile: string,
  program: string,
  test: string,
  require: string,
  operations: string,
  programProject: string,
  waterfall: string,
}

const Store = createContext({} as ContextProps);

export function useCreateProjectProStore() {
  return useContext(Store);
}

export const StoreProvider = withRouter(injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    AppState: {
      currentMenuType: {
        organizationId,
      },
    },
    intl: { formatMessage },
    intlPrefix,
    projectId,
    isShowTestPrefix,
    isShowAgilePrefix,
    isWATERFALL,
    projectData,
  } = props;

  const categoryCodes = useMemo(() => ({
    devops: 'N_DEVOPS',
    agile: 'N_AGILE',
    program: 'N_PROGRAM',
    test: 'N_TEST',
    require: 'N_REQUIREMENT',
    operations: 'N_OPERATIONS',
    programProject: 'N_PROGRAM_PROJECT',
    waterfall: 'N_WATERFALL',
  }), []);

  const editProjectStore = useStore();
  const categoryDs = useMemo(
    () => new DataSet(CategoryDataSet({ organizationId, categoryCodes })), [organizationId],
  );
  const formDs = useMemo(() => new DataSet(FormDataSet({
    isShowTestPrefix, intlPrefix, isShowAgilePrefix, formatMessage, isWATERFALL,
  })), [organizationId, projectId]);

  useEffect(() => {
    if (isWATERFALL) {
      projectData.projectConclusionTime = projectData.projectEstablishmentTime ? moment(projectData.projectEstablishmentTime, 'YYYY-MM-DD') : null;
      projectData.projectEstablishmentTime = projectData.projectEstablishmentTime ? moment(projectData.projectEstablishmentTime, 'YYYY-MM-DD') : null;
    }
    formDs.loadData([projectData]);
    loadData();
  }, [projectId, organizationId]);

  const loadData = async () => {
    try {
      await categoryDs.query();
      if (projectData && projectData.categories && projectData.categories.length) {
        let isProgram = false;
        let isProgramProject = false;
        let isRequire = false;
        let isAgile = false;
        forEach(projectData.categories, async ({ code: categoryCode }: { code: string}) => {
          switch (categoryCode) {
            case categoryCodes.program:
              isProgram = true;
              break;
            case categoryCodes.programProject:
              isProgramProject = true;
              break;
            case categoryCodes.require:
              isRequire = true;
              break;
            case categoryCodes.agile:
              isAgile = true;
              break;
            default:
              break;
          }
        });
        categoryDs.forEach(async (categoryRecord) => {
          const currentCode = categoryRecord.get('code');
          if (some(projectData.categories, ['code', currentCode])) {
            categoryDs.select(categoryRecord);
          }
          switch (currentCode) {
            case categoryCodes.program:
              if ((projectData.beforeCategory || '').includes(categoryCodes.program)) {
                categoryRecord.setState('isProgram', true);
              }
              if (isProgram && await editProjectStore.hasProgramProjects(
                organizationId, projectId,
              )) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.agile:
              if ((projectData.beforeCategory || '').includes(categoryCodes.agile)) {
                categoryRecord.setState('isAgile', true);
              }
              if (isProgramProject) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.require:
              categoryRecord.setState('isRequire', isRequire);
              categoryRecord.setState('disabled', !isProgram && !isAgile);
              break;
            default:
              break;
          }
        });
      }
    } catch (e) {
      //
    }
  };

  const value = {
    ...props,
    prefixCls: 'c7ncd-project-edit',
    categoryCodes,
    organizationId,
    formDs,
    categoryDs,
    editProjectStore,
    projectId,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

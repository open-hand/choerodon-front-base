import React, {
  createContext, useContext, useEffect, useMemo,
} from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { DataSet } from 'choerodon-ui/pro';
import { forEach, some } from 'lodash';
import { injectIntl } from 'react-intl';
import FormDataSet from './FormDataSet';
import CategoryDataSet from './CategoryDataSet';
import StatusDataSet from './StatusDataSet';
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
  standardDisable: string[],
  infoDs: DataSet
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

  const standardDisable = useMemo(() => ([
    categoryCodes.require, categoryCodes.program, categoryCodes.operations,
  ]), []);

  const editProjectStore = useStore();

  const categoryDs = useMemo(() => new DataSet(CategoryDataSet({
    organizationId,
    categoryCodes,
    editProjectStore,
  })), [organizationId]);

  const statusDs = useMemo(() => new DataSet(StatusDataSet({
    organizationId, projectId,
  })), [projectId]);

  const formDs = useMemo(() => new DataSet(FormDataSet({
    isShowTestPrefix, intlPrefix, isShowAgilePrefix, formatMessage, isWATERFALL, statusDs,
  })), [organizationId, projectId, statusDs]);

  useEffect(() => {
    formDs.loadData([projectData]);
    loadData();
  }, [projectId, organizationId]);

  const loadData = async () => {
    try {
      await statusDs.query();
      await categoryDs.query();
      // const projectData = await formDs.query();
      await editProjectStore.checkSenior(organizationId);

      const isSenior = editProjectStore.getIsSenior;

      // await axios.all([categoryDs.query(), editProjectStore.checkSenior(organizationId)]);
      // const isSenior = editProjectStore.getIsSenior;
      if (projectData && projectData.categories && projectData.categories.length) {
        const isBeforeProgram = (projectData.beforeCategory || '')?.split(',').includes(categoryCodes.program);
        const isBeforeAgile = (projectData.beforeCategory || '').includes(categoryCodes.agile);
        let isProgram = false;
        let isProgramProject = false;
        let isRequire = false;
        let isAgile = false;
        let isWaterfall = false;
        forEach(projectData.categories, async ({ code: categoryCode }: { code: string}) => {
          switch (categoryCode) {
            case categoryCodes.waterfall:
              isWaterfall = true;
              break;
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
        categoryDs.setState({
          isEdit: true,
          isBeforeAgile,
          isBeforeProgram,
          isAgile,
          isProgram,
          isWaterfall,
        });
        categoryDs.forEach(async (categoryRecord) => {
          const currentCode = categoryRecord.get('code');
          if (some(projectData.categories, ['code', currentCode])) {
            categoryDs.select(categoryRecord);
          }
          switch (currentCode) {
            case categoryCodes.program:
              // eslint-disable-next-line max-len
              if (!isSenior || (isBeforeAgile && !isBeforeProgram) || (isProgram && await editProjectStore.hasProgramProjects(organizationId, projectId))) {
                categoryRecord.setState('disabled', true);
              }
              break;
            case categoryCodes.agile:
              categoryRecord.setState({
                isAgile: isBeforeAgile,
                disabled: isProgramProject || (isBeforeProgram && !isProgram),
              });
              break;
            case categoryCodes.require:
              categoryRecord.setState({
                isRequire,
                disabled: !isSenior || (!isProgram && !isAgile),
              });
              break;
            case categoryCodes.operations:
              categoryRecord.setState('disabled', !isSenior);
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
    standardDisable,
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
})));

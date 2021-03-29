import React, {
  createContext, useContext, useMemo, useEffect,
} from 'react';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { DataSet } from 'choerodon-ui/pro';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import MenuListDataSet from './MenuListDataSet';
import FormDataSet from './FormDataSet';
import LabelDataSet from './LabelDataSet';
import useStore from './useStore';
import ProjectMenuListDataSet from './ProjectMenuListDataSet';

const Store = createContext();

export function useCreateRoleStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props) => {
  const {
    AppState: { currentMenuType: { projectId, organizationId } },
    intl: { formatMessage },
    children,
    level,
    roleId,
  } = props;

  const roleStore = useStore();
  const roleLabelsDs = useMemo(() => new DataSet(LabelDataSet()), []);
  const menuDs = useMemo(
    () => new DataSet(MenuListDataSet({ level, organizationId, roleId })), [level, organizationId],
  );
  const projectMenuDs = useMemo(
    () => new DataSet(ProjectMenuListDataSet()), [],
  );
  const formDs = useMemo(() => new DataSet(FormDataSet({
    level, roleId, roleLabelsDs, organizationId, menuDs, formatMessage,
  })), [level, roleId, organizationId]);

  async function loadData() {
    await formDs.query();
    forEach(formDs.current.get('menuList'), (item) => {
      if (item.checkedFlag === 'Y') {
        // eslint-disable-next-line no-param-reassign
        item.isChecked = true;
      }
    });
    menuDs.loadData(formDs.current.get('menuList'));
    if (!isEmpty(formDs.current.get('projectList'))) {
      forEach(formDs.current.get('projectList'), (item) => {
        if (item.checkedFlag === 'Y') {
          // eslint-disable-next-line no-param-reassign
          item.isChecked = true;
        }
      });
      projectMenuDs.loadData(formDs.current.get('projectList'));
    }
  }

  useEffect(() => {
    if (level === 'project') {
      roleLabelsDs.query();
    }
    if (roleId) {
      loadData();
    } else {
      menuDs.query();
      formDs.create();
    }
  }, []);

  const value = {
    ...props,
    formDs,
    menuDs,
    projectMenuDs,
    roleStore,
    prefixCls: 'base-org-role-create',
  };

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));

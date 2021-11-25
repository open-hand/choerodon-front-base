import React, { createContext, useMemo } from 'react';
import { DataSet } from 'choerodon-ui/pro';
import { useFormatCommon, useFormatMessage } from '@choerodon/master';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { useLocalStore } from 'mobx-react-lite';
import { withRouter } from 'react-router-dom';
import ClientDataSet from './ClientDataSet';
import OptionsDataSet from './OptionsDataSet';
import useStore from './useStore';

const Store = createContext();
export default Store;

export const StoreProvider = withRouter(injectIntl(inject('AppState')(
  (props) => {
    // 是否为项目层客户端
    const isProject = props.match.url.includes('pro-client');
    const {
      AppState: {
        currentMenuType: {
          id, type, organizationId, projectId,
        },
      }, children, intl,
    } = props;
    const intlPrefix = 'organization.pwdpolicy';
    const formatCommon = useFormatCommon();
    const formatClient = useFormatMessage(intlPrefix);

    const orgId = type === 'organization' ? id : organizationId;
    const clientStore = useStore();
    const optionsDataSet = useMemo(
      () => new DataSet(OptionsDataSet(orgId, isProject, projectId)), [orgId, isProject, projectId],
    );
    const clientDataSet = useMemo(
      () => new DataSet(ClientDataSet(orgId, isProject, projectId, formatClient)), [orgId],
    );

    const remoteMobxStore = useLocalStore(() => ({
      disableAllBtn: false,
      get getDisableAllBtn() {
        return remoteMobxStore.disableAllBtn;
      },
      setDisable(status) {
        remoteMobxStore.disableAllBtn = status;
      },
    }));

    const value = {
      projectId,
      orgId,
      id,
      clientDataSet,
      optionsDataSet,
      remoteMobxStore,
      intl,
      intlPrefix,
      clientStore,
      isProject,
      formatCommon,
      formatClient,
    };
    return (
      <Store.Provider value={value}>
        {children}
      </Store.Provider>
    );
  },
)));

import React, { useContext } from 'react';
import { PageWrap, PageTab, asyncRouter } from '@choerodon/boot';
import { Divider } from 'choerodon-ui';
import { mount, has } from '@choerodon/inject';
import BasicInfo from './basic-info';
import Ldap from './LDAP';
import WorkCalendarHome from './WorkCalendar';
import Store from '@/routes/organization/organization-setting/stores';
// import AAA from './thirdParty-appManagement';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const {
    formatClient,
  } = useContext(Store);

  const data = [
    {
      title: formatClient({ id: 'base.organizeInformation' }),
      route: '/iam/organization-setting/info',
      tabKey: 'choerodon.code.organization.general-info',
      component: BasicInfo,
    },
    {
      title: formatClient({ id: 'ldap.ldapSet' }),
      route: '/iam/organization-setting/ldap',
      tabKey: 'choerodon.code.organization.general-ldap',
      component: Ldap,
    },
    {
      title: formatClient({ id: 'workingCalendar.workingCalendar' }),
      route: '/iam/organization-setting/working-calendar',
      tabKey: 'choerodon.code.organization.general-calendar',
      component: WorkCalendarHome,
    },
    // {
    //   title: formatClient({ id: 'thirdPartyAppManagement.thirdPartyAppManagement' }),
    //   route: '/iam/organization-setting/thirdParty-appManagement',
    //   tabKey: 'choerodon.code.organization.thirdParty-appManagement',
    //   component: AAA,
    // },
  ];

  has('base-business:thirdPartyAppManagement') && data.push({
    title: formatClient({ id: 'thirdPartyAppManagement.thirdPartyAppManagement' }),
    route: '/iam/organization-setting/thirdParty-appManagement',
    tabKey: 'choerodon.code.organization.thirdParty-appManagement',
    component: () => mount('base-business:thirdPartyAppManagement', {}),
  });

  return (
    <PageWrap noHeader={[]}>
      {data.map(({
        title, route, tabKey, component,
      }) => (
        <PageTab
          key={tabKey}
          title={title}
          route={route}
          tabKey={tabKey}
          component={component}
        />
      ))}
    </PageWrap>
  );
}

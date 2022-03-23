import React, { useContext } from 'react';
import { PageWrap, PageTab, asyncRouter } from '@choerodon/boot';
import BasicInfo from './basic-info';
import Ldap from './LDAP';
import WorkCalendarHome from './WorkCalendar';
import ThirdPartyAppManagement from './thirdParty-appManagement';
import Store from '@/routes/organization/organization-setting/stores';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const {
    formatClient,
  } = useContext(Store);
  return (
    <PageWrap noHeader={[]}>
      <PageTab route="/iam/organization-setting/info" component={BasicInfo} title={formatClient({ id: 'base.organizeInformation' })} tabKey="choerodon.code.organization.general-info" />
      <PageTab route="/iam/organization-setting/ldap" component={Ldap} title={formatClient({ id: 'ldap.ldapSet' })} tabKey="choerodon.code.organization.general-ldap" />
      <PageTab route="/iam/organization-setting/working-calendar" component={WorkCalendarHome} title={formatClient({ id: 'workingCalendar.workingCalendar' })} tabKey="choerodon.code.organization.general-calendar" />
      <PageTab route="/iam/organization-setting/thirdParty-appManagement" component={ThirdPartyAppManagement} title={formatClient({ id: 'thirdPartyAppManagement.thirdPartyAppManagement' })} tabKey="choerodon.code.organization.thirdParty-appManagement" />
    </PageWrap>
  );
}

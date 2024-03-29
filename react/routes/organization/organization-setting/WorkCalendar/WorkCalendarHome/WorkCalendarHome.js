import React, { Component, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  stores, axios, TabPage, Header, Content, Permission, Breadcrumb, HeaderButtons,
} from '@choerodon/boot';
import { Button } from 'choerodon-ui';
import { Modal, Form, Output } from 'choerodon-ui/pro';
import WorkCalendar from './Component/WorkCalendar';
import Store from './stores';
import WorkCalendarSider from './WorkCalendarSider';
import './index.less';
import MainStore from '@/routes/organization/organization-setting/stores';

function noop() {

}
const modalKey = Modal.key();
export default observer(() => {
  const context = useContext(Store);
  const {
    formatClient,
  } = useContext(MainStore);
  const { calendarDataSet, holidayDataSet, workDaySettingDataSet } = context;
  const saturdayWork = workDaySettingDataSet.current && workDaySettingDataSet.current.getPristineValue('saturdayWork');
  const sundayWork = workDaySettingDataSet.current && workDaySettingDataSet.current.getPristineValue('sundayWork');
  const useHoliday = workDaySettingDataSet.current && workDaySettingDataSet.current.getPristineValue('useHoliday');

  function handleEdit() {
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '修改工作日历',
      children: <WorkCalendarSider context={context} />,
      style: { width: 740 },
      className: 'work-calendar-sider',
      fullScreen: true,
      cancelText: '取消',
    });
  }

  return (
    <TabPage service={['choerodon.code.organization.setting.general-setting.ps.working-calendar']}>
      <Header title="工作日历">
        <HeaderButtons
          showClassName={false}
          items={([{
            name: formatClient({ id: 'workingCalendar.edit' }),
            icon: 'edit-o',
            display: true,
            permissions: ['choerodon.code.organization.setting.general-setting.ps.update.working-calendar'],
            handler: handleEdit,
          }])}
        />
      </Header>
      <Breadcrumb />
      <Content className="work-calendar">
        <Form
          pristine
          dataSet={workDaySettingDataSet}
          className="work-calendar-form"
          labelLayout="horizontal"
          labelWidth={180}
          labelAlign="left"
        >
          <Output name="areaCode" renderer={() => '亚洲'} />
          <Output name="timeZoneCode" renderer={() => '(GMT+08:00)Shanghai'} />
          <Output
            name="objectVersionNumber"
            renderer={() => (
              <WorkCalendar
                saturdayWork={saturdayWork}
                sundayWork={sundayWork}
                useHoliday={useHoliday}
                selectDays={calendarDataSet.toData()}
                holidayRefs={holidayDataSet.toData()}
                updateSelete={noop}
              />
            )}
          />
        </Form>

      </Content>
    </TabPage>
  );
});

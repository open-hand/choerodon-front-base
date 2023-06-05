import React, { useContext, Fragment } from 'react';
import {
  Action,
  Content,
  Header,
  Page,
  Permission,
  Breadcrumb,
  TabPage,
  HeaderButtons,
} from '@choerodon/boot';
import { Form, Output, Modal } from 'choerodon-ui/pro';
import { withRouter } from 'react-router-dom';
import { Button } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import './OrganizationBasic.less';
import { CONSTANTS } from '@choerodon/master';
import TransferModal from '@/components/transferModal';

import InfoForm from './InfoForm';

import Store from '../stores';

const modalKey = Modal.key();

const transferModalKey = Modal.key();

const InfoView = observer(() => {
  const {
    organizationDataSet: dataSet,
    AppState,
    intl,
    orgName,
    formatClient,
    orgId,
  } = useContext(Store);
  const imageUrl = dataSet.current && dataSet.current.getPristineValue('imageUrl');
  const handleRefresh = () => {
    dataSet.query();
  };
  // eslint-disable-next-line consistent-return
  async function handleSave() {
    try {
      if (await dataSet.submit()) {
        handleRefresh();
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  function handleCancel() {
    dataSet.reset();
    return true;
  }

  const openTransferModal = () => {
    Modal.open({
      key: transferModalKey,
      title: formatClient({ id: 'base.transfer' }),
      children: <TransferModal tenantId={orgId} refresh={handleRefresh} />,
      style: { width: CONSTANTS.MODAL_WIDTH.MIDDLE },
    });
  };

  function openModal() {
    Modal.open({
      key: modalKey,
      drawer: true,
      title: '修改信息',
      style: { width: 380 },
      children: (
        <InfoForm
          intl={intl}
          dataSet={dataSet}
          AppState={AppState}
          orgName={orgName}
        />
      ),
      fullScreen: true,
      onOk: handleSave,
      okText: '保存',
      onCancel: handleCancel,
    });
  }
  return (
    <TabPage
      service={['choerodon.code.organization.setting.general-setting.ps.info']}
    >
      <Header>
        <HeaderButtons
          showClassName={false}
          items={[
            // {
            //   name: formatClient({ id: 'base.Edit' }),
            //   icon: 'edit-o',
            //   permissions: [
            //     'choerodon.code.organization.setting.general-setting.ps.update.info',
            //   ],
            //   handler: openModal,
            // },
            // {
            //   name: formatClient({ id: 'base.transfer' }),
            //   icon: 'sync_alt',
            //   permissions: [
            //     'choerodon.code.organization.setting.general-setting.ps.orgTransfer',
            //   ],
            //   handler: openTransferModal,
            // },
          ]}
        />
      </Header>

      <Breadcrumb />

      <Content className="c7n-organization-page-content">
        <Form
          pristine
          labelWidth={130}
          dataSet={dataSet}
          className="c7n-organization-form"
          labelLayout="horizontal"
          labelAlign="left"
          columns={3}
        >
          <Output name="tenantName" colSpan={1} />

          <div
            colSpan={1}
            rowSpan={3}
            className="c7n-organization-formImg"
            label={formatClient({ id: 'base.logo' })}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="图片" />
            ) : (
              <div className="c7n-organization-formImg-wrapper">
                {orgName[0]}
              </div>
            )}
          </div>
          <Output name="tenantNum" newLine />
          <Output
            name="address"
            newLine
            renderer={({ text }) => text || '无'}
          />
          <Output
            name="homePage"
            newLine
            renderer={({ text }) => text || '暂未设置官网地址'}
          />
          <Output name="ownerRealName" newLine />
        </Form>
      </Content>
    </TabPage>
  );
});
export default withRouter(InfoView);

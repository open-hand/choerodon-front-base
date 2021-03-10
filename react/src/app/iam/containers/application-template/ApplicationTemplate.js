import React, { useEffect, useState } from 'react';
import {
  Page, Header, Breadcrumb, Content,
} from '@choerodon/boot';
import { Table, Modal } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import HeaderButtons from '@choerodon/testmanager-pro/lib/components/header-buttons';
import { useAppTemplateStore } from '@/src/app/iam/containers/application-template/stores';
import { withRouter } from 'react-router-dom';
import AddTemplate from './components/addTemplate';
import { mapping } from './stores/templateTableDataSet';

const { Column } = Table;

export default withRouter(observer((props) => {
  const {
    TemplateTableDataSet,
  } = useAppTemplateStore();

  const [type, setType] = useState('');

  console.log(props);

  useEffect(() => {
    const urlParams = new URLSearchParams(props.location.search);
    setType(urlParams.get('type'));
  }, []);

  /**
   * 创建自定义模板
   */
  const handleCreateAppTemplate = () => {
    Modal.open({
      title: '创建应用模板',
      key: Modal.key(),
      children: <AddTemplate />,
      drawer: true,
      okText: '创建',
      style: { width: '3.8rem' },
    });
  };

  return (
    <Page service={[]}>
      <Header title="应用模板">
        <HeaderButtons
          items={[{
            permissions: [],
            name: '创建应用模板',
            icon: 'playlist_add',
            handler: handleCreateAppTemplate,
            display: 'true,',
          }, {
            permissions: [],
            name: '刷新',
            icon: 'refresh',
            handler: () => {},
            display: true,
          }]}
          showClassName={false}
        />
      </Header>
      <Breadcrumb />
      <Content>
        <Table dataSet={TemplateTableDataSet}>
          <Column name={mapping.appTemplate.name} />
          <Column name={mapping.temCode.name} />
          <Column name={mapping.repo.name} />
          <Column name={mapping.source.name} />
          <Column name={mapping.createTime.name} />
          <Column name={mapping.status.name} />
        </Table>
      </Content>
    </Page>
  );
}));

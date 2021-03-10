import React from 'react';
import {
  Form, TextField, SelectBox, Select,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { useAddTemplateStore } from '@/src/app/iam/containers/application-template/components/addTemplate/stores';
import { mapping } from './stores/addTemplateDataSet';

export default observer(() => {
  const {
    AddTemplateDataSet,
  } = useAddTemplateStore();

  const renderCreateWayDom = (createWayValue) => {
    switch (createWayValue) {
      case 'exist':
        return <Select name={mapping.appTemplate.name} />;
        break;
      case 'gitlab':
        return [
          <TextField name={mapping.gitlabAddress.name} />,
          <TextField name={mapping.token.name} />,
        ];
        break;
      case 'github':
        return [
          <TextField name={mapping.githubAddress.name} />,
        ];
      default:
        return '';
    }
  };

  return (
    <Form className="c7ncd-appAddTemplate-form" dataSet={AddTemplateDataSet}>
      <TextField name={mapping.templateName.name} />
      <TextField name={mapping.templateCode.name} />
      <SelectBox name={mapping.createWay.name} />
      { renderCreateWayDom(AddTemplateDataSet.current.get(mapping.createWay.name)) }
    </Form>
  );
});

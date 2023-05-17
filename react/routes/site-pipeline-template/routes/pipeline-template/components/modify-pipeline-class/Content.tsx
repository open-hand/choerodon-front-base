import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Form, TextField } from 'choerodon-ui/pro';
import { useModifyPipelineClassStore } from './stores';
import {} from '@choerodon/master';

import {} from '@choerodon/components';

const ModifyPipelineClass = () => {
  const {
    mainStore,
    prefixCls,
    formatModifyPipelineClass,
    formatCommon,
    isEdit,
    modifyPipelineClassDs,
    pipelineClassManagementDs,
    record,
    modal,
  } = useModifyPipelineClassStore();

  useEffect(() => {
    if (isEdit) {
      modifyPipelineClassDs.loadData([{
        id: record?.get('id'),
        category: record?.get('category'),
      }]);
    }
  }, []);

  async function handleOk() {
    try {
      const validateResult = await modifyPipelineClassDs.validate();
      if (!validateResult) {
        return false;
      }
      await modifyPipelineClassDs.submit();
      pipelineClassManagementDs.query();
      return true;
    } catch (err) {
      return false;
    }
  }
  modal.handleOk(handleOk);

  return (
    <div className={prefixCls}>
      <Form dataSet={modifyPipelineClassDs}>
        <TextField name="category" />
      </Form>
    </div>
  );
};

export default observer(ModifyPipelineClass);

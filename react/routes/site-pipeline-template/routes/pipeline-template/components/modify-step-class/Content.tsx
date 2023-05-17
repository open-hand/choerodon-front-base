import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Form, TextField } from 'choerodon-ui/pro';
import { useModifyStepClassStore } from './stores';
import {} from '@choerodon/master';

import {} from '@choerodon/components';

const ModifyStepClass = () => {
  const {
    mainStore,
    prefixCls,
    formatModifyStepClass,
    formatCommon,
    modifyStepClassDs,
    isEdit,
    record,
    modal,
    stepClassManagementDs,
  } = useModifyStepClassStore();

  useEffect(() => {
    if (isEdit) {
      modifyStepClassDs.loadData([{
        builtIn: record?.get('builtIn'),
        id: record?.get('id'),
        name: record?.get('name'),
      }]);
    }
  }, []);

  async function handleOk() {
    try {
      const validateResult = await modifyStepClassDs.validate();
      if (!validateResult) {
        return false;
      }
      await modifyStepClassDs.submit();
      stepClassManagementDs.query();
      return true;
    } catch (err) {
      return false;
    }
  }
  modal.handleOk(handleOk);

  return (
    <div className={prefixCls}>
      <Form dataSet={modifyStepClassDs}>
        <TextField name="name" />
      </Form>
    </div>
  );
};

export default observer(ModifyStepClass);

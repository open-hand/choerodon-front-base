import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { useModifyTaskGroupStore } from './stores';
import {} from '@choerodon/master';
import { Form, TextField } from 'choerodon-ui/pro';
import {} from '@choerodon/components';
// import { useTaskGroupManageStore } from '../task-group-manage/stores';

const ModifyTaskGroup = () => {
  const {
    mainStore,
    prefixCls,
    formatModifyTaskGroup,
    formatCommon,
    modifyTaskGroupDs,
    modal,
    taskGoupManagementDs,
    isEdit,
    record,
  } = useModifyTaskGroupStore();

  useEffect(() => {
    if (isEdit) {
      modifyTaskGroupDs.loadData([{
        id: record?.get('id'),
        type: record?.get('type'),
        name: record?.get('name'),
      }]);
    }
  }, []);
  async function handleOk() {
    try {
      const validateResult = await modifyTaskGroupDs.validate();
      if (!validateResult) {
        return false;
      }
      await modifyTaskGroupDs.submit();
      taskGoupManagementDs.query();
      return true;
    } catch (err) {
      return false;
    }
  }
  modal.handleOk(handleOk);
  return (
    <div className={prefixCls}>
      <Form dataSet={modifyTaskGroupDs}>
        <TextField name="name" />
      </Form>
    </div>
  );
};

export default observer(ModifyTaskGroup);

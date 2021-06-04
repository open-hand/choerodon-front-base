import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { DataSet, Select, message } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import { axios } from '@choerodon/boot';
import FormSelectEditor from '../../components/formSelectEditor';

export default observer(({
  onCancel, onOk, ds, record, organizationId, optionsDataSet, isProject, projectId, modal,
}) => {
  const isFirstRender = useRef(true);

  modal.handleOk(handleOk);
  modal.handleCancel(handleCancel);

  function handleCancel() {
    ds.reset();
  }
  // eslint-disable-next-line consistent-return
  async function handleOk() {
    try {
      let path;
      if (isProject) {
        path = `/iam/choerodon/v1/organizations/${organizationId}/clients-project/${projectId}/${record.get('id')}/assign_roles`;
      } else {
        path = `/iam/choerodon/v1/organizations/${organizationId}/clients/${record.get('id')}/assign_roles`;
      }
      const result = await axios
        .post(path, JSON.stringify(ds.current.toData().roles.filter((v) => v)));
      if (result && result.failed) {
        return false;
      }
      await ds.query();
      message.info('保存成功');
      return true;
    } catch (err) {
      // message.error(err);
      return false;
    }
  }
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (ds.current.get('roles').length === 0) {
        ds.current.set('roles', ['']);
      }
    }
  }, []);
  return (
    <div className="safe-modal">
      <FormSelectEditor
        record={ds.current}
        optionDataSet={optionsDataSet}
        name="roles"
        addButton="添加其他角色"
        maxDisable
      >
        {((itemProps) => (
          <Select
            {...itemProps}
            labelLayout="float"
              // renderer={renderOption}
            searchable
            style={{ width: '100%' }}
          />
        ))}
      </FormSelectEditor>
    </div>
  );
});

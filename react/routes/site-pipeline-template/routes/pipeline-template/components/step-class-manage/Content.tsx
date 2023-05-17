import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Table, Modal, Form, Button,
  TextField, Icon, message,
} from 'choerodon-ui/pro';
import { UserInfo } from '@choerodon/components';

import { Action, pipelineTemplateApi } from '@choerodon/master';
import {
  CONSTANTS,
} from '@choerodon/boot';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import ModifyStepClass from '../modify-step-class';

import { useStepClassManageStore } from './stores';

const { Column } = Table;
const {
  MODAL_WIDTH: {
    MIN,
  },
} = CONSTANTS;
const StepClassManage = () => {
  const {
    mainStore,
    prefixCls,
    formatStepClassManage,
    formatCommon,
    stepClassManagementDs,
  } = useStepClassManageStore();

  useEffect(() => {

  }, []);

  const renderCreator = ({ value }:any) => (value ? (
    <UserInfo
      realName={value.realName}
      loginName={value.loginName}
      avatar={value.imageUrl}
    />
  ) : '平台预置');

  const handleChange = (value:String) => {
    stepClassManagementDs.setQueryParameter('name', value);
    stepClassManagementDs.query();
  };
  const modifyStepClassModalKey = Modal.key();
  const deleteStepClassModalKey = Modal.key();
  const handleModify = (isEdit?:boolean, record?:Record) => {
    Modal.open({
      key: modifyStepClassModalKey,
      title: isEdit ? formatStepClassManage({ id: 'modifyStepClass' }) : formatStepClassManage({ id: 'addStepClass' }),
      drawer: true,
      style: {
        width: MIN,
      },
      okText: isEdit ? formatCommon({ id: 'modify' }) : formatStepClassManage({ id: 'add' }),
      children: <ModifyStepClass
        isEdit={isEdit}
        record={record}
        stepClassManagementDs={stepClassManagementDs}
      />,
    });
  };

  const deleteStepClass = async (record?:Record) => {
    try {
      const res = await pipelineTemplateApi.deleteStepClass('0', record?.get('id'));
      if (res.failed) {
        return false;
      }
      stepClassManagementDs.query();
      message.success('删除成功');
      return true;
    } catch (err) {
      return false;
    }
  };
  const handleDelete = (record?:Record) => {
    const isDetele = record?.get('templateNumber') === '0';
    Modal.open({
      key: deleteStepClassModalKey,
      title: isDetele ? formatStepClassManage({ id: 'delete' }) : formatStepClassManage({ id: 'notDelete' }),
      style: {
        width: MIN,
      },
      onOk: isDetele ? () => deleteStepClass(record) : () => true,
      okCancel: !!isDetele,
      okText: isDetele ? formatCommon({ id: 'delete' }) : formatStepClassManage({ id: 'iKnow' }),
      children: isDetele ? `确认要删除步骤分类“${record?.get('name')}”吗？` : '该步骤分类在平台层或组织层存在关联的步骤模板，无法删除',
    });
  };

  const renderAction = ({ record }:any) => {
    const actionDatas = [];
    if (!record.get('builtIn')) {
      actionDatas.push({
        text: formatCommon({ id: 'modify' }),
        action: () => handleModify(true, record),
      });
      actionDatas.push({
        text: formatCommon({ id: 'delete' }),
        action: () => handleDelete(record),
      });
    }

    // eslint-disable-next-line consistent-return
    return <Action data={actionDatas} />;
  };
  return (
    <div className={prefixCls}>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <TextField placeholder="请输入搜索内容" prefix={<Icon type="search" />} onChange={handleChange} />
        <Button icon="playlist_add" onClick={() => handleModify()} funcType={'flat' as any}>添加步骤分类</Button>
      </div>
      <Table dataSet={stepClassManagementDs} border={false} queryBar={'none' as any}>
        <Column className="text-gray" name="name" tooltip={'overflow' as any} />
        <Column renderer={renderAction} />
        <Column className="text-gray" name="templateNumber" tooltip={'overflow' as any} />
        <Column className="text-gray" name="creator" renderer={renderCreator} tooltip={'overflow' as any} />
        <Column className="text-gray" name="creationDate" tooltip={'overflow' as any} />
      </Table>
    </div>
  );
};

export default observer(StepClassManage);

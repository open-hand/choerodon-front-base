import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { UserInfo } from '@choerodon/components';
import { Action, pipelineTemplateApi } from '@choerodon/master';
import {
  TextField, Button, Table, Modal, Icon, message,
} from 'choerodon-ui/pro';

import Record from 'choerodon-ui/pro/lib/data-set/Record';

import {
  CONSTANTS,
} from '@choerodon/boot';

import ModifyTaskGroup from '../modify-task-group';
import { useTaskGroupManageStore } from './stores';

const { Column } = Table;
const {
  MODAL_WIDTH: {
    MIN,
  },
} = CONSTANTS;
const TaskGroupManage = () => {
  const {
    mainStore,
    prefixCls,
    formatTaskGroupManage,
    formatCommon,
    taskGoupManagementDs,
  } = useTaskGroupManageStore();

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
    taskGoupManagementDs.setQueryParameter('name', value);
    taskGoupManagementDs.query();
  };
  const modifyTaskGroupModalKey = Modal.key();
  const deleteTaskGroupModalKey = Modal.key();
  const handleModify = (isEdit?:boolean, record?:Record) => {
    Modal.open({
      key: modifyTaskGroupModalKey,
      title: isEdit ? formatTaskGroupManage({ id: 'modifyTaskGroup' }) : formatTaskGroupManage({ id: 'addTaskGroup' }),
      drawer: true,
      style: {
        width: MIN,
      },
      okText: isEdit ? formatCommon({ id: 'modify' }) : formatTaskGroupManage({ id: 'add' }),
      children: <ModifyTaskGroup
        isEdit={isEdit}
        record={record}
        taskGoupManagementDs={taskGoupManagementDs}
      />,
    });
  };

  const deleteTaskGroup = async (record?:Record) => {
    try {
      const res = await pipelineTemplateApi.deleteTaskGroup('0', record?.get('id'));
      if (res.failed) {
        return false;
      }
      taskGoupManagementDs.query();
      message.success('删除成功');
      return true;
    } catch (err) {
      return false;
    }
  };
  const handleDelete = (record?:Record) => {
    const isDetele = record?.get('templateNumber') === '0';
    Modal.open({
      key: deleteTaskGroupModalKey,
      title: isDetele ? formatTaskGroupManage({ id: 'delete' }) : formatTaskGroupManage({ id: 'notDelete' }),
      style: {
        width: MIN,
      },
      onOk: isDetele ? () => deleteTaskGroup(record) : () => true,
      okCancel: !!isDetele,
      okText: isDetele ? formatCommon({ id: 'delete' }) : formatTaskGroupManage({ id: 'iKnow' }),
      children: isDetele ? `确认要删除任务分组“${record?.get('name')}”吗？` : '该任务分组在平台层或组织层存在关联的任务模板，无法删除，无法删除',
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
  const nameList:any = {
    测试构建: 'test',
    单元测试: 'test_execution',
    代码扫描: 'playlist_add_check',
    镜像构建: 'build_circle-o',
    构建: 'build-o',
  };
  const renderName = ({ value, record }:any) => (value ? (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon type={nameList[value] ? nameList[value] : 'baseline-list_alt'} style={{ color: 'var(--help-icon-color)', marginRight: '5px' }} />
      {value}
    </div>
  ) : '');
  return (
    <div className={prefixCls}>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <TextField placeholder="请输入搜索内容" prefix={<Icon type="search" />} onChange={handleChange} />
        <Button icon="playlist_add" onClick={() => handleModify()} funcType={'flat' as any}>添加任务分组</Button>
      </div>
      <Table dataSet={taskGoupManagementDs} border={false} queryBar={'none' as any}>
        <Column className="text-gray" name="name" tooltip={'overflow' as any} renderer={renderName} />
        <Column renderer={renderAction} />
        <Column className="text-gray" name="templateNumber" tooltip={'overflow' as any} />
        <Column className="text-gray" name="creator" renderer={renderCreator} tooltip={'overflow' as any} />
        <Column className="text-gray" name="creationDate" tooltip={'overflow' as any} />
      </Table>
    </div>
  );
};

export default observer(TaskGroupManage);

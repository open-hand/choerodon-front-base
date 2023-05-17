import React, {
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Action, pipelineTemplateApi } from '@choerodon/master';
import {
  Table, Modal, Form, Button, TextField, Icon, message, Tooltip,
} from 'choerodon-ui/pro';
import { UserInfo } from '@choerodon/components';

import Record from 'choerodon-ui/pro/lib/data-set/Record';

import {
  CONSTANTS,
} from '@choerodon/boot';
import ModifyPipelineClass from '../modify-pipeline-class';

import { usePipelineClassManageStore } from './stores';
import customImage from '@/images/custom.svg';

const { Column } = Table;
const {
  MODAL_WIDTH: {
    MIN,
  },
} = CONSTANTS;
const PipelineClassManage = () => {
  const {
    mainStore,
    prefixCls,
    formatPipelineClassManage,
    formatCommon,
    pipelineClassManagementDs,
  } = usePipelineClassManageStore();

  useEffect(() => {

  }, []);
  const renderCategory = ({ value, record }: any) => (value ? (
    <>
      <div className={`${prefixCls}-table-avatar-warp`}>
        <Tooltip title={value}>
          <img src={record.get('image') ? record.get('image') : customImage} alt="" className={`${prefixCls}-table-avatar`} />
        </Tooltip>
        <Tooltip title={value}>
          <span className={`${prefixCls}-table-avatar-text`}>{value}</span>
        </Tooltip>
      </div>
    </>
  ) : '');

  const renderCreator = ({ value }: any) => (value ? (
    <UserInfo
      realName={value.realName}
      loginName={value.loginName}
      avatar={value.imageUrl}
    />
  ) : '平台预置');

  const handleChange = (value: String) => {
    pipelineClassManagementDs.setQueryParameter('name', value);
    pipelineClassManagementDs.query();
  };
  const modifyPipelineClassModalKey = Modal.key();
  const deletePipelineClassModalKey = Modal.key();
  const handleModify = (isEdit?: boolean, record?: Record) => {
    Modal.open({
      key: modifyPipelineClassModalKey,
      title: isEdit ? formatPipelineClassManage({ id: 'modifyPipelineClass' }) : formatPipelineClassManage({ id: 'addPipelineClass' }),
      drawer: true,
      style: {
        width: MIN,
      },
      okText: isEdit ? formatCommon({ id: 'modify' }) : formatPipelineClassManage({ id: 'add' }),
      children: <ModifyPipelineClass
        isEdit={isEdit}
        record={record}
        pipelineClassManagementDs={pipelineClassManagementDs}
      />,
    });
  };
  const deletePipelineClass = async (record?: Record) => {
    try {
      const res = await pipelineTemplateApi.deletePipelineClass('0', record?.get('id'));
      if (res.failed) {
        return false;
      }
      pipelineClassManagementDs.query();
      message.success('删除成功');
      return true;
    } catch (err) {
      return false;
    }
  };
  const handleDelete = (record?: Record) => {
    const isDetele = record?.get('templateNumber') === '0';
    Modal.open({
      key: deletePipelineClassModalKey,
      title: isDetele ? formatPipelineClassManage({ id: 'delete' }) : formatPipelineClassManage({ id: 'notDelete' }),
      style: {
        width: MIN,
      },
      onOk: isDetele ? () => deletePipelineClass(record) : () => true,
      okCancel: !!isDetele,
      okText: isDetele ? formatCommon({ id: 'delete' }) : formatPipelineClassManage({ id: 'iKnow' }),
      children: isDetele ? `确认要删除流水线分类“${record?.get('category')}”吗？` : '该流水线分类在平台层或组织层存在管理的流水线模板，无法删除。',
    });
  };

  const renderAction = ({ record }: any) => {
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
        <Button icon="playlist_add" onClick={() => handleModify()} funcType={'flat' as any}>添加流水线分类</Button>
      </div>
      <Table className={`${prefixCls}-table`} dataSet={pipelineClassManagementDs} border={false} queryBar={'none' as any}>
        <Column className="text-gray" name="category" renderer={renderCategory} />
        <Column renderer={renderAction} />
        <Column className="text-gray" name="templateNumber" tooltip={'overflow' as any} />
        <Column className="text-gray" name="creator" renderer={renderCreator} tooltip={'overflow' as any} />
        <Column className="text-gray" name="creationDate" tooltip={'overflow' as any} />
      </Table>
    </div>
  );
};

export default observer(PipelineClassManage);

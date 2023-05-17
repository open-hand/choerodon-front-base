/* eslint-disable */
import React, { useEffect } from "react";
import { Table,Modal,message} from "choerodon-ui/pro";
import { observer } from "mobx-react-lite";
import {usePipelineTemplateStore} from '../stores';
import { UserInfo } from '@choerodon/components';
import { Action } from '@choerodon/master';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {pipelineTemplateApi} from '@choerodon/master';
import { get as getInject} from '@choerodon/inject';
import {
  CUSTOM_BUILD, STEP_TEMPLATE,MAVEN_BUILD,TASK_TEMPLATE
} from '@choerodon/devops/lib/routes/app-pipeline/CONSTANTS.js';
import omit from 'lodash/omit';

const { Column } = Table;

export default observer(() => {


  useEffect(() => {
    // approvalDataSet.query();
  }, []);
  const renderSource=({value}:any)=>{
    console.log('value',value);
    return value==='true'?'预定义':'自定义';
  }

  const deleteTaskTemplateModalKey = Modal.key();
  const {taskTemplateDs,formatCommon,formatPipelineTemplate,taskTemplateRefresh}=usePipelineTemplateStore();
  const deleteTaskTemplate= async (record?:Record)=>{
    try {
      const res=await pipelineTemplateApi.deleteTaskTemplate('0',record?.get('id'));
      if (res.failed) {
       return false;
      } 
      taskTemplateDs.query();
      message.success('删除成功');
      return true;
    
    } catch (err) {
      return false;
    }
  }
  const handleDelete=async (record?:Record)=>{
    const isDetele=await pipelineTemplateApi.checkTaskTemplateDelete('0',record?.get('id'));//校验是否可以删除任务模板
    Modal.open({
      key: deleteTaskTemplateModalKey,
      title:isDetele?formatPipelineTemplate({ id: 'delete' }):formatPipelineTemplate({ id: 'notDelete' }),
      onOk:isDetele?()=>deleteTaskTemplate(record):()=>true,
      okCancel:isDetele?true:false,
      okText:isDetele?formatCommon({ id: 'delete' }):formatPipelineTemplate({ id: 'iKnow' }),
      children:isDetele?`确定要删除任务模板“${record?.get('name')}”吗？`:'项目层存在使用该任务模板的流水线，无法删除',
    });
  }

  const handleEditTaskTemplate = async(record:any) => {
    const res= await pipelineTemplateApi.getJobDetailById(record.get('id'));
    getInject('devops:handlePipelineModal')(
      {
        title: '修改任务模板',
        level: 'site',
        data: { 
          ...res,
          template: TASK_TEMPLATE,
        },
        callback: async (data:any) => {
          const params = {
            id:record.get('id'),
            builtIn: false,
            devopsCiStepVOList: data.devopsCiStepVOList,
            groupId: data.groupId,
            image: data.image,
            name: data.name,
            script: data.script,
            sourceId: 0,
            sourceType: 'site',
            toDownload: data.toDownload,
            toUpload: data.toUpload,
            type: data.type,
            openParallel:data.openParallel,
            parallel:data.parallel,
          };
         const res= await pipelineTemplateApi.editTaskTemplate(params);
         try {
            if (res && !res.failed) {
              message.info('修改成功');
              taskTemplateRefresh();
              return true;
            }
            return false;
          } catch (error) {
            return error;
          }

        },
      },
    );
  };

  const basedOnTempCreate = async(record:any) => {
    const res= await pipelineTemplateApi.getJobDetailById(record.get('id'));
    const param=omit(res,['id','name']);
    getInject('devops:handlePipelineModal')(
      {
        data: {
          level: 'site',
          ...param,
          type: MAVEN_BUILD,
          template: TASK_TEMPLATE,
        },
        callback: async (data:any) => {
          const params = {
            builtIn: false,
            devopsCiStepVOList: data.devopsCiStepVOList,
            groupId: data.groupId,
            image: data.image,
            name: data.name,
            script: data.script,
            sourceId: 0,
            sourceType: 'site',
            toDownload: data.toDownload,
            toUpload: data.toUpload,
            type: data.type,
          };
          const res = await pipelineTemplateApi.createTaskTemplate(params);
          try {
            if (res && !res.failed) {
              message.info('创建成功');
              taskTemplateRefresh();
              return true;
            }
            return false;
          } catch (error) {
            return error;
          }
        },
      },
    );
  };
  const renderAction=({record}:any)=>{
    const actionDatas = [];
    if(record.get('builtIn')!=='true'){
        actionDatas.push({
            text: formatCommon({ id: 'modify' }),
            action: ()=>handleEditTaskTemplate(record),
          });
        actionDatas.push({
          text:formatCommon({ id: 'delete' }),
          action: () =>handleDelete(record),
        });

    }
    actionDatas.push({
      text:formatPipelineTemplate({ id: 'basedTemplateCreation' }),
      action: () =>basedOnTempCreate(record),
    });
   
    // eslint-disable-next-line consistent-return
    return <Action data={actionDatas} />;
  }
  const renderCreator=({value}:any)=>{
    return value? <UserInfo
    realName={value.realName}
    loginName={value.loginName}
    avatar={value.imageUrl}
  />:'平台预置';
  }
  return (
    <Table dataSet={taskTemplateDs}>
      <Column lock className="text-gray" name="name" tooltip={'overflow' as any}/>
      <Column renderer={renderAction} />
      <Column className="text-gray" name="groupName" tooltip={'overflow' as any}/>
      <Column className="text-gray" name="stepNumber" tooltip={'overflow' as any}/>
      <Column className="text-gray" name="creator" renderer={renderCreator} tooltip={'overflow' as any}/>
      <Column className="text-gray" name="creationDate"  tooltip={'overflow' as any}/>
      <Column className="text-gray" name="builtIn" renderer={renderSource} tooltip={'overflow' as any}/>
    </Table>
  );
});
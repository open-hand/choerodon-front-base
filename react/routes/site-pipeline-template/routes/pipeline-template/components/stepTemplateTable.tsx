/* eslint-disable */
import React from "react";
import { Table,Modal,message} from "choerodon-ui/pro";
import { observer } from "mobx-react-lite";
import {usePipelineTemplateStore} from '../stores';
import { UserInfo } from '@choerodon/components';
import { Action } from '@choerodon/master';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {pipelineTemplateApi} from '@choerodon/master';
import { get as getInject} from '@choerodon/inject';
import {
  CUSTOM_BUILD, STEP_TEMPLATE
} from '@choerodon/devops/lib/routes/app-pipeline/CONSTANTS.js';
const { Column } = Table;

export default observer(() => {
  const {stepTemplateDs,formatCommon,formatPipelineTemplate,stepTemplateRefresh}=usePipelineTemplateStore();
  const renderSource=({value}:any)=>{
    return value==='true'?'预定义':'自定义';
  }
  const renderCreator=({value}:any)=>{
    return value? <UserInfo
    realName={value.realName}
    loginName={value.loginName}
    avatar={value.imageUrl}
  />:'平台预置';
  }

  const deleteStepTemplate= async (record?:Record)=>{
    try {
      const res=await pipelineTemplateApi.deleteStepTemplate('0',record?.get('id'));
      if (res.failed) {
       return false;
      } 
      stepTemplateDs.query();
      message.success('删除成功');
        return true;
    
    } catch (err) {
      return false;
    }
  }
  const deleteStepTemplateModalKey = Modal.key();
  const handleDelete=async (record?:Record)=>{
    const isDetele=await pipelineTemplateApi.checkStepTemplateDelete('0',record?.get('id'));//校验是否可以删除步骤模板
    Modal.open({
      key: deleteStepTemplateModalKey,
      title:isDetele?formatPipelineTemplate({ id: 'delete' }):formatPipelineTemplate({ id: 'notDelete' }),
      onOk:isDetele?()=>deleteStepTemplate(record):()=>true,
      okCancel:isDetele?true:false,
      okText:isDetele?formatCommon({ id: 'delete' }):formatPipelineTemplate({ id: 'iKnow' }),
      children:isDetele?`确定要删除步骤模板“${record?.get('name')}”吗？`:'平台层或组织层存在使用该步骤模板的任务模板，无法删除',
    });
  }
  const handleEditStepTemplate = (record:any) => {
    getInject('devops:handlePipelineModal')(
      {
        title: '修改步骤模板',
        level: 'site',
        data: {
          ...record.toData(),
          type: CUSTOM_BUILD,
          template: STEP_TEMPLATE,
        },
        callback: async (data:any) => {
          const params = {
            id:record.get('id'),
            builtIn: false,
            name: data.name,
            script: data.script,
            sourceId: 0,
            sourceType: 'site',
            type: data.type,
            categoryId: data.categoryId
          };
         const res= await pipelineTemplateApi.editStepTemplate(params);
         try {
            if (res && !res.failed) {
              stepTemplateRefresh();
              message.info('修改成功');
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
            action: ()=>handleEditStepTemplate(record),
          });
          actionDatas.push({
            text:formatCommon({ id: 'delete' }),
            action: () =>handleDelete(record),
          });

     }
   
    // eslint-disable-next-line consistent-return
    return <Action data={actionDatas} />;
  }
  return (
    <Table dataSet={stepTemplateDs}>
      <Column lock className="text-gray" name="name" tooltip={'overflow' as any}/>
      <Column renderer={renderAction} />
      <Column className="text-gray" name="categoryName" tooltip={'overflow' as any}/>
      <Column className="text-gray" name="creator" renderer={renderCreator} tooltip={'overflow' as any}/>
      <Column className="text-gray" name="creationDate" tooltip={'overflow' as any}/>
      <Column className="text-gray" name="builtIn" renderer={renderSource} tooltip={'overflow' as any}/>
    </Table>
  );
});
/* eslint-disable */
import React, { useEffect } from "react";
import { Table,message,Modal} from "choerodon-ui/pro";
import { observer } from "mobx-react-lite";
import {usePipelineTemplateStore} from '../stores';
import { UserInfo,StatusTag} from '@choerodon/components';
import { Action } from '@choerodon/master';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {pipelineTemplateApi} from '@choerodon/master';
const { Column } = Table;

export default observer(() => {


  useEffect(() => {
    // approvalDataSet.query();
  }, []);

  const {pipelineTempaleDs,formatCommon,formatPipelineTemplate,handleEdit,basedOnTempCreate}=usePipelineTemplateStore();
  const renderCreator=({value}:any)=>{
    return value? <UserInfo
    realName={value.realName}
    loginName={value.loginName}
    avatar={value.imageUrl}
  />:'平台预置';
  }
  const renderSource=({value}:any)=>{
    return value?'预定义':'自定义';
  }
  const renderEnable=({value}:any)=>{
    return <StatusTag
    type="default"
    colorCode={value?'enable':'DEFAULT' as any}
    name={value?'启用':'停用'}
  />
  }
  const enablePipelineTemplate= async (record?:Record)=>{
      const res=await pipelineTemplateApi.enablePipelineTemplate('0',record?.get('id'));
      if (res.failed) {
        message.error('启用失败');
      }else{
        pipelineTempaleDs.query();
      message.success('启用成功');
      }
  }

  const stopPipelineTemplate= async (record?:Record)=>{
      const res=await pipelineTemplateApi.stopPipelineTemplate('0',record?.get('id'));
      if (res.failed) {
        message.error('停用失败');
      }else{
      pipelineTempaleDs.query();
      message.success('停用成功');}

  }
  const deletePipelineTemplateModalKey = Modal.key();
  const deletePipelineTemplate= async (record?:Record)=>{
      const res=await pipelineTemplateApi.deletePipelineTemplate('0',record?.get('id'));
      if (res.failed) {
        message.error('删除失败');
      } 
      pipelineTempaleDs.query();
      message.success('删除成功');
  }
  const handleDelete=async (record?:Record)=>{
    Modal.open({
      key: deletePipelineTemplateModalKey,
      title:formatPipelineTemplate({ id: 'delete' }),
      onOk:()=>deletePipelineTemplate(record),
      okCancel:true,
      okText:formatCommon({ id: 'delete' }),
      children:`确定要删除流水线模板“${record?.get('name')}”吗？`,
    });
  }
  const renderAction=({record}:any)=>{
    const actionDatas = [];
      if(!record.get('builtIn')&&record.get('enable')){
        actionDatas.push({
            text: formatCommon({ id: 'modify' }),
            action: ()=>handleEdit(record.get('id')),
          });
          actionDatas.push({
            text:formatPipelineTemplate({ id: 'basedTemplateCreation' }),
            action: () =>basedOnTempCreate(record.get('id')),
          });
        
          actionDatas.push({
            text: formatCommon({ id: 'stop' }),
            action:()=>stopPipelineTemplate(record),
          });
          actionDatas.push({
            text:formatCommon({ id: 'delete' }),
            action: () =>handleDelete(record),
      });}

      if(!record.get('builtIn')&&!record.get('enable')){
        actionDatas.push({
          text: formatCommon({ id: 'modify' }),
          action: ()=>handleEdit(record.get('id')),
        });
        actionDatas.push({
          text:formatPipelineTemplate({ id: 'basedTemplateCreation' }),
         action: () =>() =>basedOnTempCreate(record.get('id')),
        });
        actionDatas.push({
          text: formatCommon({ id: 'enable' }),
          action: ()=>enablePipelineTemplate(record),
        });
        actionDatas.push({
          text:formatCommon({ id: 'delete' }),
          action: () =>handleDelete(record),
    });}
    if(record.get('builtIn')&&record.get('enable')){
      actionDatas.push({
        text:formatPipelineTemplate({ id: 'basedTemplateCreation' }),
        action: () =>basedOnTempCreate(record.get('id')),
      });
      actionDatas.push({
        text: formatCommon({ id: 'stop' }),
        action: ()=>stopPipelineTemplate(record),
      });
      }

      if(record.get('builtIn')&&!record.get('enable')){
        actionDatas.push({
          text:formatPipelineTemplate({ id: 'basedTemplateCreation' }),
          action: () =>basedOnTempCreate(record.get('id')),
        });
        actionDatas.push({
          text: formatCommon({ id: 'enable' }),
          action:()=>enablePipelineTemplate(record),
        });
        }
   
    // eslint-disable-next-line consistent-return
    return <Action data={actionDatas} />;
  }
  const renderCategory=({value}:any)=>{
    return value.category;
  }
  return (
    <Table dataSet={pipelineTempaleDs}>
      <Column lock className="text-gray" name="name" tooltip={'overflow' as any}/>
      <Column renderer={renderAction} />
      <Column  className="text-gray" name="ciTemplateCategoryVO" renderer={renderCategory} tooltip={'overflow' as any}/>
      <Column  className="text-gray" name="creator" renderer={renderCreator} tooltip={'overflow' as any}/>
      <Column  className="text-gray" name="creationDate" tooltip={'overflow' as any}/>
      <Column  className="text-gray" name="builtIn" renderer={renderSource} tooltip={'overflow' as any}/>
      <Column  className="text-gray" name="enable" renderer={renderEnable} tooltip={'overflow' as any}/>
    </Table>
  );
});
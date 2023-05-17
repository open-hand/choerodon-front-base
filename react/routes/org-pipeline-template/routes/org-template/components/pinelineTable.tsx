import React, { } from 'react';
import { Action, devopsOrganizationsApi } from '@choerodon/master';
import { StatusTag, UserInfo } from '@choerodon/components';
import { Table, Modal, Tooltip } from 'choerodon-ui/pro';
import { message } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  CONSTANTS,
} from '@choerodon/boot';
import { TableQueryBarType, TableColumnTooltip } from 'choerodon-ui/pro/lib/table/enum';
import { useMainStore } from '../stores';

const { Column } = Table;

const modalKey = Modal.key();

const {
  MODAL_WIDTH: {
    MIDDLE,
  },
} = CONSTANTS;

export default observer((props: any) => {
  const {
    pipelineTempCreate, pipelineTempEdit,
  } = props;
  const {
    prefixCls,
    intlPrefix,
    formatClient,
    pinelineTableDs,
    pinelineTempRefresh,
  } = useMainStore();

  const handleDelete = async (id: string | number, name: string) => {
    Modal.open({
      key: modalKey,
      title: '删除流水线模板',
      children: `确定要删除流水线模板“${name}”吗？`,
      style: {
        width: MIDDLE,
      },
      // eslint-disable-next-line consistent-return
      onOk: async () => {
        try {
          await devopsOrganizationsApi.deleteOrgPinelineTemplate(id);
          pinelineTempRefresh();
          message.success('删除成功!');
          pinelineTempRefresh();
          return true;
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  const handleDisable = async (id: string | number) => {
    await devopsOrganizationsApi.invalidOrgPinelineTemplate({
      ci_pipeline_template_id: id,
    });
    pinelineTempRefresh();
  };

  const handleEnable = async (id: string | number) => {
    await devopsOrganizationsApi.enableOrgPinelineTemplate({
      ci_pipeline_template_id: id,
    });
    pinelineTempRefresh();
  };

  const handleMouseEnter = (e:any, record:Record) => {
    const { currentTarget } = e;
    if (isOverflow(currentTarget)) {
      Tooltip.show(currentTarget, {
        title: record.get('name'),
        placement: 'top',
      });
    }
  };

  const handleMouseLeave = () => {
    Tooltip.hide();
  };

  const renderName = ({ text, record }: any) => {
    const actionDatas = [];
    if (!record.get('builtIn') && record.get('sourceType') !== 'site') {
      actionDatas.push(
        {
          service: [],
          text: '修改',
          action: () => { pipelineTempEdit(record.get('id')); },
        },
      );
      actionDatas.push(
        {
          service: [],
          text: '删除',
          action: () => { handleDelete(record.get('id'), record.get('name')); },
        },
      );
      record.get('enable') === 'true' ? actionDatas.push(
        {
          service: [],
          text: '禁用',
          action: () => { handleDisable(record.get('id')); },
        },
      ) : actionDatas.push(
        {
          service: [],
          text: '启用',
          action: () => { handleEnable(record.get('id')); },
        },
      );
    }

    actionDatas.push(
      {
        service: [],
        text: '基于模板创建',
        action: () => { pipelineTempCreate(record.get('id')); },
      },
    );

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span
          onMouseEnter={(e) => { handleMouseEnter(e, record); }}
          onMouseLeave={handleMouseLeave}
          style={{ maxWidth: 350, textOverflow: 'ellipsis', overflow: 'hidden' }}
        >
          {text}
        </span>

        <Action data={actionDatas} />
      </div>
    );
  };

  const renderCreator = ({ text, record }: any) => {
    if (record.get('sourceType') === 'site' || record.get('builtIn')) {
      return (
        <div>{formatClient({ id: 'pipeline.prefabricated' })}</div>
      );
    }
    return (
      <div>
        <UserInfo
          loginName={record?.get('creator')?.ldap ? record?.get('creator')?.loginName : record?.get('creator')?.email}
          realName={record?.get('creator')?.realName}
          avatar={record?.get('creator')?.imageUrl}
        />
      </div>
    );
  };

  const renderSourceType = ({ text, record }: any) => {
    if (record.get('sourceType') === 'site' || record.get('builtIn')) {
      return (
        <div>{formatClient({ id: 'pipeline.predefine' })}</div>
      );
    }
    return (
      <div>{formatClient({ id: 'pipeline.custom' })}</div>
    );
  };

  const renderEnable = ({ text, record }: any) => (
    <StatusTag
      type="default"
      colorCode={record.get('enable') === 'true' ? 'success' : 'terminating'}
      name={record.get('enable') === 'true' ? formatClient({ id: 'pipeline.enable' }) : formatClient({ id: 'pipeline.disable' })}
    />
  );

  return (
    <Table pristine dataSet={pinelineTableDs} border={false} queryBar={'bar' as TableQueryBarType}>
      <Column width={500} renderer={renderName} className="text-gray" name="name" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" name="ciTemplateCategoryVO.category" tooltip={'overflow' as TableColumnTooltip} />
      <Column renderer={renderCreator} className="text-gray" name="creator" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" name="creationDate" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" renderer={renderSourceType} name="sourceType" tooltip={'overflow' as TableColumnTooltip} />
      <Column renderer={renderEnable} className="text-gray" name="enable" tooltip={'overflow' as TableColumnTooltip} />
    </Table>
  );
});

import React, { } from 'react';
import { Action, devopsOrganizationsApi } from '@choerodon/master';
import { UserInfo } from '@choerodon/components';
import {
  Modal, Table, Tooltip,
} from 'choerodon-ui/pro';
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  CONSTANTS,
} from '@choerodon/boot';
import { message } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';
import { TableQueryBarType, TableColumnTooltip } from 'choerodon-ui/pro/lib/table/enum';
import { useMainStore } from '../stores';

const { Column } = Table;
const modalKey1 = Modal.key();
const modalKey2 = Modal.key();

const {
  MODAL_WIDTH: {
    MIDDLE,
  },
} = CONSTANTS;

export default observer((props: any) => {
  const {
    tempOperation,
  } = props;
  const {
    prefixCls,
    intlPrefix,
    formatClient,
    taskTableDs,
    taskTempRefresh,
  } = useMainStore();

  const handleDelete = async (id: any, name: string) => {
    const enableDelete = await devopsOrganizationsApi.checkIfCanDelOrgTasksTemplate(id);
    if (!enableDelete) {
      Modal.open({
        key: modalKey1,
        title: '无法删除',
        children: '项目层存在使用该任务模板的流水线，无法删除。',
        style: {
          width: MIDDLE,
        },
        okText: '我知道了',
        okCancel: false,
      });
    } else {
      Modal.open({
        key: modalKey2,
        title: '删除任务模板',
        children: `确定要删除任务模板“${name}”吗？`,
        okText: '删除',
        cancelText: '取消',
        onOk: async () => {
          try {
            await devopsOrganizationsApi.deleteOrgTasksTemplate(id);
            message.success('删除成功!');
            taskTempRefresh();
            return true;
          } catch (error) {
            console.log(error);
            return false;
          }
        },
      });
    }
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
    const actionDatas = [
      {
        service: [],
        text: '基于模板创建',
        action: () => { tempOperation(record.toData(), 'create'); },
      },
    ];
    if (!record.get('builtIn') && record.get('sourceType') !== 'site') {
      actionDatas.push(
        {
          service: [],
          text: '删除',
          action: () => { handleDelete(record.get('id'), record.get('name')); },
        },
      );
      actionDatas.unshift(
        {
          service: [],
          text: '修改',
          action: () => { tempOperation(record.toData(), 'edit'); },
        },
      );
    }
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
    if (record.get('sourceType') === 'site' || record.get('createdBy') === '0') {
      return (
        <div>{formatClient({ id: 'tasks.prefabricated' })}</div>
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
        <div>{formatClient({ id: 'tasks.predefine' })}</div>
      );
    }
    return (
      <div>{formatClient({ id: 'tasks.custom' })}</div>
    );
  };

  return (
    <Table pristine dataSet={taskTableDs} border={false} queryBar={'bar' as TableQueryBarType}>
      <Column width={500} renderer={renderName} className="text-gray" name="name" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" name="groupName" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" name="stepNumber" tooltip={'overflow' as TableColumnTooltip} />
      <Column renderer={renderCreator} className="text-gray" name="createdBy" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" name="creationDate" tooltip={'overflow' as TableColumnTooltip} />
      <Column renderer={renderSourceType} className="text-gray" name="sourceType" tooltip={'overflow' as TableColumnTooltip} />
    </Table>
  );
});

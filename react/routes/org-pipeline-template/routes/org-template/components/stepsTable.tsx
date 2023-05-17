import React, { } from 'react';
import { Action, devopsOrganizationsApi } from '@choerodon/master';
import { UserInfo } from '@choerodon/components';
import { Modal, Table, Tooltip } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { message } from 'choerodon-ui';
import isOverflow from 'choerodon-ui/pro/lib/overflow-tip/util';
import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  CONSTANTS,
} from '@choerodon/boot';
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

export default observer((props:any) => {
  const { tempOperation } = props;
  const {
    prefixCls,
    intlPrefix,
    formatClient,
    stepsTableDs,
    stepsTempRefresh,
  } = useMainStore();

  const handleDelete = async (id:any, name: string) => {
    const enableDelete = await devopsOrganizationsApi.checkIfCanDelOrgStepsTemplate(id);
    if (!enableDelete) {
      Modal.open({
        key: modalKey1,
        title: '无法删除',
        children: '组织层存在使用该步骤模板的任务模板，无法删除。',
        okText: '我知道了',
        okCancel: false,
      });
    } else {
      Modal.open({
        key: modalKey2,
        title: '删除步骤模板',
        children: `确定要删除步骤模板“${name}”吗？`,
        okText: '删除',
        cancelText: '取消',
        onOk: async () => {
          try {
            await devopsOrganizationsApi.deleteOrgStepsTemplate(id);
            message.success('删除成功!');
            stepsTempRefresh();
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
    let actionDatas;
    if (!record.get('builtIn') && record.get('sourceType') !== 'site') {
      actionDatas = [
        {
          service: [],
          text: '修改',
          action: () => { tempOperation(record.toData(), 'edit'); },
        },
        {
          service: [],
          text: '删除',
          action: () => { handleDelete(record.get('id'), record.get('name')); },
        },
      ];
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
        <div>{formatClient({ id: 'steps.prefabricated' })}</div>
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
        <div>{formatClient({ id: 'steps.predefine' })}</div>
      );
    }
    return (
      <div>{formatClient({ id: 'steps.custom' })}</div>
    );
  };

  return (
    <Table pristine dataSet={stepsTableDs} border={false} queryBar={'bar' as TableQueryBarType}>
      <Column width={500} renderer={renderName} className="text-gray" name="name" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" name="categoryName" tooltip={'overflow' as TableColumnTooltip} />
      <Column renderer={renderCreator} className="text-gray" name="createdBy" tooltip={'overflow' as TableColumnTooltip} />
      <Column className="text-gray" name="creationDate" tooltip={'overflow' as TableColumnTooltip} />
      <Column renderer={renderSourceType} className="text-gray" name="sourceType" tooltip={'overflow' as TableColumnTooltip} />
    </Table>
  );
});

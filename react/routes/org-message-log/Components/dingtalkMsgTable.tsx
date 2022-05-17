import React, { useEffect } from 'react';
import { Action, messageApi } from '@choerodon/master';
import { StatusTag } from '@choerodon/components';
import { Table, Modal, message } from 'choerodon-ui/pro';
import { mount } from '@choerodon/inject';
import { observer } from 'mobx-react-lite';

import Record from 'choerodon-ui/pro/lib/data-set/Record';
import {
  CONSTANTS,
} from '@choerodon/boot';
import { TableQueryBarType, TableColumnTooltip } from 'choerodon-ui/pro/lib/table/enum';
import { useStore } from '../stores';

const { Column } = Table;

const modalKey = Modal.key();

const {
  MODAL_WIDTH: {
    MAX,
  },
} = CONSTANTS;

const TableIndex = () => {
  const {
    prefixCls,
    intlPrefix,
    dingtalkMsgTableDs,
  } = useStore();

  useEffect(() => {
    dingtalkMsgTableDs.query();
  }, []);

  const handleDetailsClick = (record: Record) => {
    const Ele = mount('notify:msgDetails', {
      msgId: record.get('id'),
      isOrgLev: true,
    });
    Modal.open({
      key: modalKey,
      children: Ele,
      title: '查看接收方详情',
      okCancel: false,
      okText: '关闭',
      drawer: true,
      style: {
        width: MAX,
      },
    });
  };

  const retryMsg = async (record:Record) => {
    try {
      await messageApi.reSendMsg(record.get('transactionId'));
      message.success('发送成功！');
    } catch (error) {
      console.log(error);
    }
  };

  const renderAction = ({ text, record }: {text:string, record:Record}) => {
    const actionDatas = [
      {
        service: [],
        text: '查看接收方详情',
        action: () => { handleDetailsClick(record); },
      },
      {
        service: [],
        text: '重发',
        action: () => { retryMsg(record); },
      },
    ];
    return (
      ['S', 'F'].includes(record.get('statusCode')) && (
        <Action data={actionDatas} />
      )
    );
  };

  const renderStatusTag = ({ value }: { value: string }) => (
    <StatusTag
      name={value || '成功'}
      colorCode={value !== '失败' ? 'success' : 'error'}
    />
  );

  return (
    <Table pristine dataSet={dingtalkMsgTableDs} border={false} queryBar={'bar' as TableQueryBarType}>
      <Column width={150} name="messageName" tooltip={'overflow' as TableColumnTooltip} />
      <Column width={60} renderer={renderAction} />
      <Column name="statusMeaning" width={100} renderer={renderStatusTag} />
      <Column name="failedReason" width={400} tooltip={'overflow' as TableColumnTooltip} />
      <Column name="creationDate" width={160} tooltip={'overflow' as TableColumnTooltip} />
    </Table>
  );
};

export default observer(TableIndex);

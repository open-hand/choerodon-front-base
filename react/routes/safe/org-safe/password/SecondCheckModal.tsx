// @ts-nocheck
import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  DataSet, Table, Button, message,
} from 'choerodon-ui/pro';
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
import TableProfessionalBar from 'choerodon-ui/pro/lib/table/query-bar/TableProfessionalBar';

import {
  addUserPhoneCheckList, deleteUserPhoneCheckList, addUserEmailCheckList, deleteUserEmailCheckList,
} from '../services/password';

export function getSecondCheckModalDataSet(organizationId: number) {
  return new DataSet({
    autoQuery: true,
    transport: {
      read: {
        url: `/iam/hzero/v1/${organizationId}/users/sec-check`,
        method: 'get',
      },
    },
    fields: [
      {
        name: 'loginName',
        label: '账户',
      },
      {
        name: 'realName',
        label: '用户描述',
      },
      {
        name: 'secCheckPhoneFlag',
        label: '启用手机验证码',
        type: FieldType.boolean,
      },
      {
        name: 'secCheckEmailFlag',
        label: '启用邮箱验证码',
        type: FieldType.boolean,
      },
    ],
    queryFields: [
      {
        name: 'loginName',
        label: '账户',
      },
      {
        name: 'realName',
        label: '用户描述',
      },
      {
        name: 'secCheckPhoneFlag',
        label: '启用手机验证码',
        type: FieldType.boolean,
        options: new DataSet({
          data: [
            { value: true, meaning: '是' },
            { value: false, meaning: '否' },
          ],
        }),
      },
      {
        name: 'secCheckEmailFlag',
        label: '启用邮箱验证码',
        type: FieldType.boolean,
        options: new DataSet({
          data: [
            { value: true, meaning: '是' },
            { value: false, meaning: '否' },
          ],
        }),
      },
    ],
  });
}

// 批量操作请求
const getBatchRequest = (
  dataSet: DataSet, organizationId: number, requestFn: Function,
) => async () => {
  try {
    await requestFn(organizationId, dataSet.selected.map((r) => r.get('id')));

    message.success('操作成功');
    dataSet.query(dataSet.currentPage);
  } catch (err) {
    window.console.error(err?.message ?? '操作失败');
  }
};

function SecondCheckModal(props: { dataSet: DataSet, organizationId:number }) {
  const { dataSet, organizationId } = props;

  const columns = [
    { name: 'loginName' },
    { name: 'realName' },
    { name: 'secCheckPhoneFlag' },
    { name: 'secCheckEmailFlag' },
  ];

  const handleAddPhone = getBatchRequest(dataSet, organizationId, addUserPhoneCheckList);
  const handleDeletePhone = getBatchRequest(dataSet, organizationId, deleteUserPhoneCheckList);
  const handleAddEmail = getBatchRequest(dataSet, organizationId, addUserEmailCheckList);
  const handleDeleteEmail = getBatchRequest(dataSet, organizationId, deleteUserEmailCheckList);

  const noSelected = dataSet.selected.length === 0;
  const disabledAddPhone = noSelected || dataSet.selected.every((record) => record.get('secCheckPhoneFlag'));
  const disabledDeletePhone = noSelected || dataSet.selected.every((record) => !record.get('secCheckPhoneFlag'));
  const disabledAddEmail = noSelected || dataSet.selected.every((record) => record.get('secCheckEmailFlag'));
  const disabledDeleteEmail = noSelected || dataSet.selected.every((record) => !record.get('secCheckEmailFlag'));

  const headerButtons = [
    <Button disabled={disabledAddPhone} icon="playlist_add" onClick={handleAddPhone}>启用手机</Button>,
    <Button disabled={disabledDeletePhone} icon="delete" onClick={handleDeletePhone}>禁用手机</Button>,
    <Button disabled={disabledAddEmail} icon="playlist_add" onClick={handleAddEmail}>启用邮箱</Button>,
    <Button disabled={disabledDeleteEmail} icon="delete" onClick={handleDeleteEmail}>禁用邮箱</Button>,
  ];

  return (
    <Table
      dataSet={dataSet}
      columns={columns}
      buttons={headerButtons}
      queryBar={(queryBarProps) => (
        <TableProfessionalBar {...queryBarProps} queryBarProps={{ labelWidth: 120 }} />
      )}
      queryFieldsLimit={2}
    />
  );
}

export default observer(SecondCheckModal);

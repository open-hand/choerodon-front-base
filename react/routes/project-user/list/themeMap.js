import { Table, TextField } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import React, { useContext } from 'react';
import { FilterTextField } from '@choerodon/components';
import theme4Style from './theme4.module.less';

const { Column } = Table;

export default (cRef) => ({
  style: {
    origin: null,
    theme4: theme4Style,
  },
  key: {
    breadCrumb: {
      origin: {},
      theme4: {

      },
    },
    render: {
      origin: ({
        dataSet,
        renderUserName,
        renderAction,
        expandMoreColumn,
        rednerEnabled,
      }) => (
        <Table labelLayout="float" pristine dataSet={dataSet}>
          <Column renderer={renderUserName} name="realName" />
          <Column renderer={renderAction} width={50} align="right" />
          <Column style={{ color: 'rgba(0, 0, 0, 0.65)' }} name="loginName" tooltip="overflow" />
          <Column minWidth={320} width={320} renderer={expandMoreColumn} className="project-user-roles" name="myRoles" />
          <Column renderer={rednerEnabled} width={100} name="enabled" align="left" />
        </Table>
      ),
      theme4: ({
        renderNewContent,
      }) => renderNewContent(),
    },
  },
});

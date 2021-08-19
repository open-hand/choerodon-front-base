import { Table, TextField } from 'choerodon-ui/pro';
import { Icon } from 'choerodon-ui';
import React, { useContext } from 'react';
import FilterTextField from '@/components/filter-textField';
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
        extraNode: (
          <FilterTextField
            filterMap={[{
              field: 'user',
              label: '用户名',
            }, {
              field: 'role',
              label: '角色',
            }, {
              field: 'status',
              label: '状态',
            }, {
              field: 'phone',
              label: '手机',
            }, {
              field: 'email',
              label: '邮箱',
            }]}
            className="theme4-c7n-member-search"
            placeholder="搜索成员"
            style={{ marginLeft: 32 }}
            prefix={(
              <Icon type="search" />
              )}
            onEnterDown={(e) => cRef?.current?.handleChangeSearch(e.target.value)}
            onChange={cRef?.current?.handleChangeSearch}
          />),
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

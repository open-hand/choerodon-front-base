/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */
import React, { useState, useImperativeHandle } from 'react';
import { CustomTabs, FilterTextField } from '@choerodon/components';
import { Icon } from 'choerodon-ui';
import { observer } from 'mobx-react-lite';

import './index.less';

const cssPrefix = 'c7ncd-projectUser-filterPage';

const ModeList = [{
  value: 'card',
  name: '卡片模式',
}, {
  value: 'list',
  name: '列表模式',
}];

const Index = observer(({
  cRef,
  onSearchCallback,
}: {
 cRef?: any,
 onSearchCallback(v: any): void,
}) => {
  const [mode, setMode] = useState(ModeList[0].value);

  useImperativeHandle(cRef, () => ({
    getMode: () => mode,
  }));

  const handleChange = (e: any, name: string, value: string, number: number) => {
    console.log(value);
    setMode(value);
  };
  return (
    <div className={cssPrefix}>
      <CustomTabs
        data={ModeList}
        onChange={handleChange}
      />
      <div>
        <FilterTextField
          filterMap={[{
            field: 'realName',
            label: '用户名',
          }, {
            field: 'roleName',
            label: '角色',
          }, {
            field: 'enable',
            label: '状态',
            options: [{
              value: true,
              name: '启用',
            }, {
              value: false,
              name: '未启用',
            }],
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
          onSearch={(value) => {
            onSearchCallback(value);
          }}
        />
      </div>
    </div>
  );
});

Index.defaultProps = {
  cRef: undefined,
};

export default Index;

export { ModeList };

/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */
import React, {
  useState, useImperativeHandle, useContext, useEffect,
} from 'react';
import { CustomTabs, FilterTextField } from '@choerodon/components';
import { Icon } from 'choerodon-ui';
import {
  Form, Select, Button, TextField,
} from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import { LabelLayoutType } from '@/interface';
import { mapping } from '../../stores/filterDataSet';
import Store from '../../stores';

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
  handelModeCallback,
}: {
 cRef?: any,
 onSearchCallback(v: any): void,
 handelModeCallback?(m: any): void,
}) => {
  const [mode, setMode] = useState(ModeList[0].value);
  const [queryParameter, setQueryParameter] = useState<{
    field?: string,
    value: any,
  }[]>([]);

  useEffect(() => {
    onSearchCallback(queryParameter);
  }, [queryParameter]);

  const {
    FilterDataSet,
  } = useContext(Store);

  useImperativeHandle(cRef, () => ({
    getMode: () => mode,
    getQueryParameter: () => queryParameter,
  }));

  /**
   * @description: 改变queryParameter并查询
   * @param {*}
   * @return {*}
   */
  const changeQueryParameterAndQuery = ({
    type,
    value,
  }: {
    type: string,
    value: any
  }) => {
    if (!type) {
      const item = queryParameter.find((i) => !i.field);
      if (item) {
        item.value = value;
      } else {
        queryParameter.push({
          value,
        });
      }
    } else {
      const item = queryParameter.find((i) => i.field === type);
      if (item) {
        item.value = value;
      } else {
        queryParameter.push({
          field: type,
          value,
        });
      }
    }
    setQueryParameter(JSON.parse(JSON.stringify(queryParameter)));
  };

  /**
   * @description: 重置
   * @param {*}
   * @return {*}
   */
  const handleReset = () => {
    FilterDataSet.reset();
    setQueryParameter([]);
  };

  const handleChange = (e: any, name: string, value: string, number: number) => {
    setMode(value);
    if (handelModeCallback) {
      handelModeCallback(value);
    }
  };
  return (
    <div className={cssPrefix}>
      <CustomTabs
        data={ModeList}
        onChange={handleChange}
      />
      <div className={`${cssPrefix}__formField`}>
        {/* <FilterTextField
          filterMap={[]}
          className="theme4-c7n-member-search"
          placeholder="搜索成员"
          style={{
            marginLeft: 32,
            width: 200,
          }}
          prefix={(
            <Icon type="search" />
              )}
          onSearch={(value) => {
            changeQueryParameterAndQuery({
              type: '',
              value,
            });
          }}
        /> */}
        <Form
          labelLayout={'placeholder' as LabelLayoutType}
          columns={5}
          dataSet={FilterDataSet}
        >
          <TextField
            prefix={(
              <Icon type="search" />
                )}
            name={mapping.params.name}
            placeholder="请输入搜索内容"
            onBlur={(e) => {
              changeQueryParameterAndQuery({
                type: '',
                value: e.target.value,
              });
            }}
            colSpan={2}
          />
          <Select
            name={mapping.role.name}
            onChange={(v) => {
              changeQueryParameterAndQuery({
                type: (mapping.role.name) as string,
                value: v,
              });
            }}
          />
          <Select
            name={mapping.status.name}
            onChange={(v) => changeQueryParameterAndQuery({
              type: (mapping.status.name) as string,
              value: v,
            })}
          />
          <Button onClick={handleReset}>
            重置
          </Button>
        </Form>
      </div>
    </div>
  );
});

Index.defaultProps = {
  cRef: undefined,
};

export default Index;

export { ModeList };

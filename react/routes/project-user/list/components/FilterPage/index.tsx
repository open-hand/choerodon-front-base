/*
 * @Author: isaac
 * @LastEditors: isaac
 * @Description:
 * i made my own lucky
 */
import React, {
  useState, useImperativeHandle, useContext, useEffect,
} from 'react';
import { CustomTabs } from '@choerodon/components';
import { Icon } from 'choerodon-ui';
import {
  Form, Select, Button, TextField,
} from 'choerodon-ui/pro';
import { C7NFormat } from '@choerodon/master';
import { observer } from 'mobx-react-lite';
import { useDebounceFn } from 'ahooks';
import { LabelLayoutType } from '@/interface';
import { mapping } from '../../stores/filterDataSet';
import Store from '../../stores';

import './index.less';

const cssPrefix = 'c7ncd-projectUser-filterPage';

const Index = observer(({
  cRef,
  onSearchCallback,
  handelModeCallback,
}: {
 cRef?: any,
 onSearchCallback(v: any): void,
 handelModeCallback?(m: any): void,
}) => {
  const {
    FilterDataSet,
    formatCommon,
    formatProjectUser,
  } = useContext(Store);

  const ModeList:any = [{
    value: 'card',
    name: formatProjectUser({ id: 'cardmode' }),
  }, {
    value: 'list',
    name: formatProjectUser({ id: 'listmode' }),
  }];
  const [mode, setMode] = useState(ModeList[0].value);
  const [queryParameter, setQueryParameter] = useState<{
    field?: string,
    value: any,
  }[]>([]);
  const { run } = useDebounceFn(
    (value?: string) => {
      changeQueryParameterAndQuery({
        type: '',
        value,
      });
    },
    {
      wait: 500,
    },
  );

  useEffect(() => {
    onSearchCallback(queryParameter);
  }, [queryParameter]);

  useImperativeHandle(cRef, () => ({
    getMode: () => mode,
    getQueryParameter: () => queryParameter,
    ModeList,
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
        className={`${cssPrefix}__tabs`}
        data={ModeList}
        onChange={handleChange}
      />
      <div className={`${cssPrefix}__formField`}>
        <Form
          labelLayout={'placeholder' as LabelLayoutType}
          columns={8}
          dataSet={FilterDataSet}
        >
          <TextField
            prefix={(
              <Icon type="search" />
            )}
            name={mapping.params.name}
            placeholder={formatCommon({ id: 'pleaseSearch' })}
            onInput={(e: any) => run(e.target.value)}
            colSpan={3}
            clearButton
            onClear={() => run()}
          />
          <Select
            colSpan={2}
            name={mapping.role.name}
            label={formatCommon({ id: 'role' })}
            onChange={(v) => {
              changeQueryParameterAndQuery({
                type: (mapping.role.name) as string,
                value: v,
              });
            }}
            dropdownMatchSelectWidth={false}
          />
          <Select
            name={mapping.status.name}
            label={formatCommon({ id: 'states' })}
            onChange={(v) => changeQueryParameterAndQuery({
              type: (mapping.status.name) as string,
              value: v,
            })}
            dropdownMatchSelectWidth={false}
            colSpan={2}
          />
          {/* @ts-ignore */}
          <Button colSpan={1} onClick={handleReset}>
            {formatCommon({ id: 'reset' })}
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

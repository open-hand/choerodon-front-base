import React, { useState, useRef } from 'react';
import { TextField } from 'choerodon-ui/pro';
import { Icon, Tag } from 'choerodon-ui';
import { TextFieldProps } from 'choerodon-ui/pro/lib/text-field/TextField';
import { useClickAway } from 'ahooks';
import _ from 'lodash';

import './index.less';

type filterMapItemType = {
  field?: string,
  label?: string
}

type filterMapType = filterMapItemType[]

interface propsType extends TextFieldProps {
  filterMap: filterMapType,
}

interface filterDataType extends filterMapItemType {
  value: string,
}

const FilterTextField = (props: propsType) => {
  const textRef = useRef();

  const [popContentDisplay, setPopContentDisplay] = useState(false);
  const [filterLabel, setFilterLabel] = useState('');
  const [filterData, setFilterData] = useState<filterDataType[]>([]);
  const [textValue, setTextValue] = useState('');

  const {
    filterMap,
    prefix,
  } = props;

  useClickAway(() => {
    if (popContentDisplay) {
      setPopContentDisplay(false);
    }
  }, () => document.querySelector('.c7ncd-filterTextField input'));

  /**
   * 点击单个item
   */
  const handleClickPopItem = (item: filterMapItemType) => {
    if (item.label) {
      setFilterLabel(item.label);
    }
    (textRef?.current as any)?.focus();
  };

  /**
   * 回车事件
   */
  const handleOnEnterDown = (e: string, data: filterDataType[]) => {
    if (e) {
      // 如果有过滤label
      if (filterLabel) {
        const item = filterMap.find((i) => i.label === filterLabel);
        if (item) {
          data.push({
            ...item,
            value: e,
          });
          setFilterLabel('');
        }
      } else {
        data.push({
          value: e,
        });
      }
      setFilterData([...data]);
      setTextValue('');
    }
  };

  const renderPopContent = (map: filterMapType): any => {
    const fieldsList = filterData.map((i) => i.field);
    return map.filter((i) => !fieldsList.includes(i.field)).map((item) => (
      <div
        role="none"
        className="c7ncd-filterTextField-popContent-item"
        onClick={() => handleClickPopItem(item)}
      >
        {item.label}
      </div>
    ));
  };

  /**
   * 删除tag
   */
  const handleDeleteItemFilterData = (index: number, data: filterDataType[]) => {
    data.splice(index, 1);
    setFilterData(data);
  };

  /**
   * 渲染tag
   */
  const renderFilterData = (data: filterDataType[]) => data.map((i, index) => (
    <Tag
      color="geekblue"
      closable
      onClose={() => handleDeleteItemFilterData(index, filterData)}
    >
      {
        i.label ? `${i.label}:${i.value}` : i.value
      }
    </Tag>
  ));

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 8) {
      if (textValue === '') {
        if (filterLabel) {
          setFilterLabel('');
        } else if (filterData && filterData.length > 0) {
          filterData.pop();
          setFilterData(_.clone(filterData));
        }
      }
    }
  };

  return (
    <div className="c7ncd-filterTextField">
      <TextField
        // @ts-ignore
        ref={textRef}
        {...props}
        onFocus={() => {
          setPopContentDisplay(true);
        }}
        value={textValue}
        onKeyUp={handleKeyUp}
        onInput={(e) => setTextValue((e.target as any).value)}
        prefix={(
          <>
            {
              prefix || (<Icon type="search" />)
            }
            {
              renderFilterData(filterData)
            }
            {
              filterLabel && <span>{`${filterLabel}:`}</span>
            }
          </>
        )}
        onEnterDown={(e) => {
          e.stopPropagation();
          handleOnEnterDown((e.target as any).value, filterData);
        }}
      />
      <div
        className="c7ncd-filterTextField-popContent"
        style={{
          display: popContentDisplay ? 'block' : 'none',
        }}
      >
        {
          renderPopContent(filterMap)
        }
      </div>
    </div>
  );
};

export default FilterTextField;

import React, { useState, useRef } from 'react';
import { TextField } from 'choerodon-ui/pro';
import { Icon, Tag } from 'choerodon-ui';
import { TextFieldProps } from 'choerodon-ui/pro/lib/text-field/TextField';
import { useClickAway } from 'ahooks';
import _ from 'lodash';

import './index.less';

type option = {
  value: any,
  name: string,
}

type filterMapItemType = {
  field?: string,
  label?: string
  options?: option[],
}

type filterMapType = filterMapItemType[]

interface propsType extends TextFieldProps {
  filterMap: filterMapType,
  onSearch(data: filterDataType[]): void,
}

interface filterDataType extends filterMapItemType {
  value: string | option | undefined,
}

const FilterTextField = (props: propsType) => {
  const textRef = useRef();

  const [popContentDisplay, setPopContentDisplay] = useState(false);
  const [filterLabel, setFilterLabel] = useState('');
  const [filterData, setFilterData] = useState<filterDataType[]>([]);
  const [textValue, setTextValue] = useState('');
  const [optionsDisplay, setOptionsDisplay] = useState<filterMapItemType | ''>('');

  const {
    filterMap,
    prefix,
    onSearch,
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
      if (item.options) {
        setOptionsDisplay(item);
      }
    }
    (textRef?.current as any)?.focus();
  };

  const renderOptionsDisplay = () => (
    <div
      className="c7ncd-filterTextField-popContent__options"
    >
      {
        optionsDisplay && optionsDisplay?.options?.map((i: option) => (
          <p role="none" onClick={() => handleOnEnterDown(i, filterData, true)}>
            {i.name}
          </p>
        ))
      }
    </div>
  );

  /**
   * 回车事件
   */
  const handleOnEnterDown = (
    e: string | option,
    data: filterDataType[],
    isOption = false,
  ) => {
    if (!isOption) {
      if (e && typeof (e) == 'string') {
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
        if (onSearch) {
          onSearch([...data]);
        }
      }
    } else {
      const item = filterMap.find((i) => i.label === filterLabel);
      if (item) {
        data.push({
          ...item,
          value: e,
        });
        setFilterLabel('');
      }
      setFilterData([...data]);
      setTextValue('');
      if (onSearch) {
        onSearch([...data]);
      }
    }
    if (onSearch) {
      onSearch(filterData);
    }
    setPopContentDisplay(false);
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
  const renderFilterData = (data: filterDataType[]) => data.map((i, index) => {
    const value = typeof (i.value) === 'string' ? i.value : i?.value?.name;
    return (
      <Tag
        color="geekblue"
        closable
        onClose={() => handleDeleteItemFilterData(index, filterData)}
      >
        {
          i.label ? `${i.label}:${value}` : value
        }
      </Tag>
    );
  });

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

  const handleFocus = () => {
    if (!filterLabel) {
      setPopContentDisplay(true);
    }
    if (!optionsDisplay && filterLabel) {
      const item = filterMap.find((i) => i.label === filterLabel);
      if (item && item.options) {
        setOptionsDisplay(item);
      }
    }
  };

  const handleBlur = () => {
    if (optionsDisplay) {
      setOptionsDisplay('');
    }
  };

  return (
    <div className="c7ncd-filterTextField">
      <TextField
        // @ts-ignore
        ref={textRef}
        {...props}
        onFocus={handleFocus}
        value={textValue}
        onKeyUp={handleKeyUp}
        onInput={(e) => setTextValue((e.target as any).value)}
        onBlur={handleBlur}
        prefix={(
          <>
            {
              prefix || (<Icon type="search" />)
            }
            {
              renderFilterData(filterData)
            }
            {
              filterLabel && (
                <span
                  style={{
                    position: 'relative',
                  }}
                >
                  {`${filterLabel}:`}
                  {
                    optionsDisplay && renderOptionsDisplay()
                  }
                </span>
              )
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

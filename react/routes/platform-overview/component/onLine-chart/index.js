import React, { useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon } from 'choerodon-ui';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import './index.less';

import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/markPoint';
import { useFormatMessage, useFormatCommon } from '@choerodon/master';
import { usePlatformOverviewStore } from '../../stores';
import ContainerBlock from '../../../org-overview/components/ContainerBlock';

const LineChart = observer(() => {
  const {
    onlineNumDs,
    onlineHourDs,
    intlPrefix,
  } = usePlatformOverviewStore();

  const record = onlineHourDs.current && onlineHourDs.toData()[0];
  const format = useFormatMessage(intlPrefix);
  const formatCommon = useFormatCommon();
  function renderY() {
    const yArr = [];
    const xArr = record && Object.keys(record).sort((a, b) => a.split(':')[0] - b.split(':')[0]);
    xArr.forEach((item) => {
      yArr.push(record[item]);
    });
    return yArr;
  }
  const getOpts = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: `${formatCommon({ id: 'time' })}：{b}<br/>${format({ id: 'people' })}：{c}`,
        padding: 13,
        backgroundColor: 'rgba(0,0,0,0.75)',
        textStyle: {
          color: '#FFF',
        },
        extraCssText: 'box-shadow:0px 2px 6px 0px rgba(0,0,0,0.12);padding: 15px 17px;',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: record && Object.keys(record).sort((a, b) => a.split(':')[0] - b.split(':')[0]),
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [{
        smooth: true,
        data: record && renderY(),
        type: 'line',
        color: ['rgba(104, 135, 232, 0.76)'],
        symbolSize: 5,
        symbol: 'circle',
        areaStyle: {
          color: 'rgba(89, 123, 228, 0.92)',
        },
        itemStyle: {
          emphasis: {
            color: '#CACAE4FF',
            borderColor: '#CACAE4FF',
          },
        },
      }],
      grid: {
        bottom: '10px', // 与容器顶部的距离
        height: '80%',
        x: '10px',
        x2: '10px',
        y2: '22px',
      },
    };
    return option;
  };
  return (
    <ContainerBlock
      width="100%"
      height="255px"
      title={format({ id: 'people' })}
      titleMarginBottom="0"
      loading={onlineHourDs.status === 'loading' || onlineNumDs.status === 'loading'}
    >
      <div className="c7n-online-chart">
        <div className="c7n-online-number">
          <span>{onlineNumDs.current && onlineNumDs.current.get('OnlineCount')}</span>
          <span>{formatCommon({ id: 'unit.people' })}</span>
        </div>
        <div className="c7n-online-mainChart">
          <ReactEchartsCore
            echarts={echarts}
            option={getOpts()}
            notMerge
            lazyUpdate
          />
        </div>
        <div className="c7n-online-daily">
          <span>
            {format({ id: 'dailyVisits' })}
            ：
          </span>
          <span>
            {onlineNumDs.current && formatCommon({ id: 'unit.times' }, { number: onlineNumDs.current.get('NumberOfVisitorsToday') })}
          </span>
        </div>
      </div>
    </ContainerBlock>

  );
});
export default LineChart;

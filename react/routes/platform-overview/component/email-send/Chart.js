import React, { useEffect, useState } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { observer } from 'mobx-react-lite';
import echarts from 'echarts';
import { useEmailSendStore } from './stores';

const Charts = observer(() => {
  const [resizeIf, setResizeIf] = useState(false);

  const {
    EmailSendStore,
    format,
    formatCommon,
  } = useEmailSendStore();

  useEffect(() => {
    function resizeCharts() {
      setResizeIf(true);
      setTimeout(() => {
        setResizeIf(false);
      }, 500);
    }
    window.addEventListener('resize', () => {
      resizeCharts();
    });
    resizeCharts();
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  const getOption = () => {
    const {
      dates,
      successNums,
      failedNums,
      totalNums,
    } = EmailSendStore.getEmailSendData;

    const totalSuccess = successNums.length > 0 ? successNums.reduce((total, currentValue) => total + currentValue) : '';
    const totalFailed = failedNums.length > 0 ? failedNums.reduce((total, currentValue) => total + currentValue) : '';

    return {
      color: ['#6887E8', '#F48590'],
      legend: {
        right: 0,
        itemHeight: 10,
        data: [{
          name: `${formatCommon({ id: 'success' })}${formatCommon({ id: 'times' })}: ${totalSuccess}`,
          icon: 'circle',
        }, {
          name: `${formatCommon({ id: 'failed' })}${formatCommon({ id: 'times' })}: ${totalFailed}`,
          icon: 'circle',
        }],
        textStyle: {
          color: '#3A345FA6',
        },
      },
      grid: {
        top: '30px',
        left: 0,
        right: '50px',
        bottom: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        position(pt) {
          return [pt[0], '10%'];
        },
        backgroundColor: 'rgba(0,0,0,0.75)',
        textStyle: {
          color: '#fff',
        },
        extraCssText: 'box-shadow:0px 2px 6px 0px rgba(0,0,0,0.12);padding: 15px 17px;',
        formatter(params) {
          return `
            ${formatCommon({ id: 'date' })}: ${`${dates[0].split('-')[0]}-${params[0].name}`}</br>
            ${formatCommon({ id: 'success' })}${format({ id: 'sendNumber' })}: ${params[0].data}</br>
            ${formatCommon({ id: 'failed' })}${format({ id: 'sendNumber' })}: ${params[1].data}</br>
            ${format({ id: 'sendTotalNumber' })}: ${totalNums[params[0].dataIndex]}</br>
            ${format({ id: 'sendSuccessRate' })} ${totalNums[params[0].dataIndex] !== 0 ? ((params[0].data / (totalNums[params[0].dataIndex])) * 100).toFixed(1) : 0}%
          `;
        },
      },
      xAxis: {
        boundaryGap: false,
        data: dates.map((d) => `${d.split('-')[1]}-${d.split('-')[2]}`),
        name: `${formatCommon({ id: 'time' })}`,
        nameTextStyle: {
          color: 'rgba(0,0,0,1)',
          fontSize: '13px',
        },
        splitLine: {
          show: true,
        },
        axisLabel: {
          color: 'rgba(0,0,0,0.65)',
        },
        axisLine: {
          lineStyle: {
            color: '#EEEEEE',
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        nameTextStyle: {
          color: 'rgba(0,0,0,1)',
          fontSize: '13px',
        },
        name: `${formatCommon({ id: 'times' })}`,
        type: 'value',
        axisLabel: { color: 'rgba(0,0,0,0.65)' },
        axisLine: {
          lineStyle: {
            color: '#EEEEEE',
          },
        },
      },
      series: [
        {
          name: `${formatCommon({ id: 'success' })}${formatCommon({ id: 'times' })}: ${totalSuccess}`,
          type: 'bar',
          stack: 'one',
          data: successNums,
          itemStyle: {
            barBorderRadius: [0, 0, 0, 0],
          },
          barWidth: 8,
        },
        {
          name: `${formatCommon({ id: 'failed' })}${formatCommon({ id: 'times' })}: ${totalFailed}`,
          type: 'bar',
          stack: 'one',
          data: failedNums,
          itemStyle: {
            barBorderRadius: [4, 4, 0, 0],
          },
          barWidth: 8,
        },
      ],
    };
  };

  return !resizeIf ? (
    <ReactEchartsCore
      echarts={echarts}
      option={getOption()}
      notMerge
      onChartReady={(chart) => {
        setTimeout(() => {
          chart.resize();
        }, 1000);
      }}
      style={{
        width: '100%',
        height: 300,
      }}
      lazyUpdate
    />
  ) : '';
});

export default Charts;

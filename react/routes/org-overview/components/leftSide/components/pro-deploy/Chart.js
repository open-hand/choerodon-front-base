import React, { useEffect, useState } from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import { observer } from 'mobx-react-lite';
import echarts from 'echarts';
import EmptyPage from '@/components/empty-page';
import { useProDeployStore } from './stores';
import { useOrgOverview } from '@/routes/org-overview/stores';

const Charts = observer(() => {
  const [resizeIf, setResizeIf] = useState(false);

  const {
    ProDeployStore,
  } = useProDeployStore();

  const {
    formatClient,
  } = useOrgOverview();

  const chartData = ProDeployStore.getChartData;

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
      dateList,
      projectDataList,
    } = chartData;
    return {
      color: ['#6887E8', '#514FA0', '#F48590'],
      legend: {
        right: 0,
        itemHeight: 10,
        data: projectDataList ? projectDataList.map((p) => ({
          name: p.name,
          icon: 'circle',
        })) : [],
        textStyle: {
          color: '#3A345FA6',
        },
      },
      grid: {
        top: '30px',
        left: projectDataList && projectDataList.length > 0 ? 0 : '20px',
        right: projectDataList && projectDataList.length > 0 ? '50px' : '53px',
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
          日期: ${params[0].name}</br>
          ${params.map((p) => (`${p.seriesName}: ${p.data}</br>`)).join('')}
        `;
        },
      },
      xAxis: {
        type: 'category',
        data: dateList,
        name: formatClient({ id: 'time' }),
        nameTextStyle: {
          color: 'rgba(0,0,0,1)',
          fontSize: '13px',
        },
        splitLine: {
          show: true,
        },
        axisLabel: { color: 'rgba(0,0,0,0.65)' },
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
        name: formatClient({ id: 'numbers' }),
        type: 'value',
        axisLabel: { color: 'rgba(0,0,0,0.65)' },
        axisLine: {
          lineStyle: {
            color: '#EEEEEE',
          },
        },
      },
      series: projectDataList ? projectDataList.map((p) => ({
        name: p.name,
        type: 'bar',
        data: p.data,
        itemStyle: {
          barBorderRadius: [4, 4, 0, 0],
        },
        barWidth: 6,
        barGap: '50%',
      })) : [],
    };
  };

  if (!chartData?.projectDataList?.length) {
    return <EmptyPage title="暂无部署情况" describe="未选择项目，暂无部署情况" />;
  }

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
        height: 216,
      }}
      lazyUpdate
    />
  ) : '';
});

export default Charts;

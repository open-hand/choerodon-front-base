import { useLocalStore } from 'mobx-react-lite';
import moment from 'moment';
import { axios } from '@choerodon/boot';

export default function useStore() {
  return useLocalStore(() => ({
    chartData: {
      x: [],
      y: [],
      percentage: [],
      totalCount: [],
    },

    get getChartData() {
      return JSON.parse(JSON.stringify(this.chartData));
    },
    loading: false,
    async initThingPerformChartData(organizationId, date) {
      this.loading = true;
      try {
        const data = await axios({
          method: 'GET',
          url: `hagd/v1/sagas/organizations/${organizationId}/instances/statistics/failure`,
          params: {
            date,
          },
        });
        const x = [];
        const y = [];
        const percentage = [];
        const totalCount = [];
        if (data.failed) {
          throw data.message;
        }
        data.forEach(d => {
          const { creationDate } = d;
          const newCreationDate = creationDate.split(' ')[0];

          function addData(xNum, yNum, percentageNum, totalCountNum) {
            x.push(xNum);
            y.push(yNum);
            percentage.push(percentageNum);
            totalCount.push(totalCountNum);
          }

          if (x.length === 0) {
            addData(newCreationDate, d.failureCount, d.percentage, d.totalCount);
          } else {
            while (moment(x[x.length - 1]).add(1, 'days').format('YYYY-MM-DD') !== newCreationDate) {
              addData(moment(x[x.length - 1]).add(1, 'days').format('YYYY-MM-DD'), 0, 0, 0);
            }
            addData(newCreationDate, d.failureCount, d.percentage, d.totalCount);
          }
        });
        this.chartData = {
          x,
          y,
          percentage,
          totalCount,
        };
        this.loading = false;
      } catch (e) {
        if (e && e.message) {
          return e.message;
        }
        return false;
      }
    },
  }));
}

import moment from 'moment';

export const getDuration = (beginDate, endDate) => {
  if (beginDate && endDate) {
    const beginTime = moment(beginDate);
    const endTime = moment(endDate);
    const duration = moment.duration(endTime - beginTime, 'ms');
    const hours = duration.get('hours');
    const minutes = duration.get('minutes');
    const seconds = duration.get('seconds');
    return `${hours ? `${hours}小时` : ''}${minutes ? `${minutes}分钟` : ''}${seconds ? `${seconds}秒` : ''}`;
  }
  return '';
};

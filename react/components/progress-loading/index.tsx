import React, { FC, useState, useEffect } from 'react';
import { Progress } from 'choerodon-ui/pro';
import { ProgressType } from 'choerodon-ui/lib/progress/enum';
import { Size } from 'choerodon-ui/lib/_util/enum';
import classnames from 'classnames';

import './index.less';

let timer:any;

function judgeLoadingTimer():void {
  if (timer) {
    clearInterval(timer);
  }
}

function timerSet(callback:CallableFunction, durations:number):void { // 设置定时
  judgeLoadingTimer();
  timer = setInterval(() => {
    callback();
  }, durations);
}

function clearTime():void {
  clearInterval(timer);
}

function formatSeconds(value:number):string {
  const day = Math.floor(value / (24 * 3600)); // Math.floor()向下取整
  const hour = Math.floor((value - day * 24 * 3600) / 3600);
  const minute = Math.floor((value - day * 24 * 3600 - hour * 3600) / 60);
  const second = value - day * 24 * 3600 - hour * 3600 - minute * 60;
  let result = '';
  if (day) {
    result += `${day}天`;
  }
  if (hour) {
    result += `${hour}时`;
  }
  if (minute) {
    result += `${minute}分`;
  }
  if (second) {
    result += `${second}秒`;
  }
  return result;
}

export interface DurationObjProps {
  finished:boolean,
  leftSeconds:number,
  percent:number,
  [field:string]:any,
}

export interface ProgressLoadingProps {
  className?:string, // 类名
  format?(percent:number):void, // 内容的模板函数,
  leftSeconds?:number, // 剩余的时间 秒单位
  percent?:number, // 0~100 百分占比多少
  startLoadingFn?():Promise<DurationObjProps>, // 请求函数，返回字段要有 finished, leftSeconds, percent 三个字段
  afterCompleteCallback?():CallableFunction, // 达到100之后的回调
  startTrigger?():boolean, // 触发函数，返回boolean
  strokeWidth?:number,
  strokeColor?:string,
  showProgressText?:boolean,
  durations?:number, // 每多少ms请求一次
  customTipText?: any, // 自定义文案
  style?: object // 样式
}

const LoadingProgress:FC<ProgressLoadingProps> = (props) => {
  const {
    className,
    format,
    startLoadingFn,
    afterCompleteCallback,
    startTrigger,
    leftSeconds,
    percent,
    strokeWidth,
    strokeColor,
    showProgressText,
    durations = 1000,
    customTipText,
    style,
  } = props;

  const prefixCls = 'c7ncd-timerProgress-spinner';

  const [value, setValue] = useState<number>(0);
  const [seconds, setLeftSeconds] = useState<number>(0);

  const loadingClassnames = classnames(prefixCls, className);

  // 组件销毁，销毁定时器
  useEffect(() => function () {
    judgeLoadingTimer();
  }, []);

  const getRunningProgress = async ():Promise<void> => {
    if (startLoadingFn) {
      try {
        const res = await startLoadingFn();
        if (res && res.failed) {
          return;
        }
        const { finished, leftSeconds: tempLeftSeconds, percent: tempPercent } = res;
        setLeftSeconds(tempLeftSeconds);
        setValue(tempPercent);
        if (finished) {
          clearTime();
          afterCompleteCallback && afterCompleteCallback();
        }
      } catch (error) {
        clearTime();
        throw new Error(error);
      }
    }
  };

  useEffect(() => {
    if (startTrigger) {
      if (startTrigger()) {
        timerSet(getRunningProgress, durations);
      } else {
        judgeLoadingTimer();
      }
    }
  }, [startTrigger]);

  const renderTipText = () => {
    if (customTipText) {
      return <span>{customTipText}</span>;
    }
    const thisSeconds = leftSeconds || seconds;
    const thisPercent = percent || value;
    if (thisPercent === 99 || thisPercent === 100) {
      return <span>即将执行完成...</span>;
    }
    if (thisSeconds) {
      return (
        <>
          <span>预计剩余执行时间：</span>
          <span>{formatSeconds(thisSeconds)}</span>
        </>
      );
    }
    return <span>正在预估时间...</span>;
  };

  const formatLoadingPercent = (tempPercent: number): React.ReactElement => (
    <div className={`${prefixCls}-span`}>
      <span>当前执行进度</span>
      <span>
        {tempPercent}
        <span>%</span>
      </span>
    </div>
  );

  return (
    <div style={style} className={loadingClassnames}>
      <Progress
        type={'circle' as any}
        size={'small' as any}
        value={percent || value}
        // @ts-ignore
        format={format || formatLoadingPercent}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
      />
      {showProgressText && (
        <div
          className={`${prefixCls}-details`}
        >
          {renderTipText()}
        </div>
      )}
    </div>
  );
};

LoadingProgress.defaultProps = {
  strokeWidth: 4,
  strokeColor: 'rgba(104, 135, 232, 1)',
  showProgressText: true,
};

export default LoadingProgress;

import React, { useState } from 'react';
import { Spin } from 'choerodon-ui/pro';
import { observer } from 'mobx-react-lite';
import './index.less';

export interface Props {
  prefixCls: string
}

const Index: React.FC<Props> = (props) => {
  // @ts-ignore
  const { modal, prefixCls } = props;

  const [syncing, setSyncing] = useState(false);

  const handleOk = async () => {
    setSyncing(true);
    modal.update({
      title: '正在同步用户中…',
      okText: '返回',
      okProps: {
        onOk: () => true,
      },
    });
    return false;
  };

  modal.handleOk(handleOk);

  return (
    <div>
      {
        !syncing && (
          <div>
            <p className={`${prefixCls}-HM-p1`}>上次同步完成时间xxxx （耗时xxxx），</p>
            <p className={`${prefixCls}-HM-p2`}>
              共同步
              &nbsp;
              <span className={`${prefixCls}-HM-success-num`}>25981</span>
              &nbsp;
              个用户成功,
              &nbsp;
              <span className={`${prefixCls}-HM-failed-num`}>0</span>
              &nbsp;
              个用户失败
            </p>
          </div>
        )
      }

      {
        syncing && (
          <div>
            <div className={`${prefixCls}-HM-syncing-div1`}><Spin size={'large' as any} /></div>
            <div className={`${prefixCls}-HM-syncing-div2`}>本次导入耗时较长，您可返回进行其他操作</div>
          </div>
        )
      }
    </div>
  );
};

export default observer(Index);

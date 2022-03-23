import React, { } from 'react';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';

export interface Props {

}

const Index: React.FC<Props> = (props) => {
  // @ts-ignore
  const { modal } = props;
  const {
    prefixCls,
  } = useStore();

  const handleOk = async () => {

  };

  modal.handleOk(handleOk);

  return (
    <div>
      <p>上次同步完成时间xxxx （耗时xxxx），</p>
      <p>
        共同步
        <span>xxxx</span>
        个用户成功,
        <span>xxx</span>
        个用户失败
      </p>
    </div>
  );
};

export default observer(Index);

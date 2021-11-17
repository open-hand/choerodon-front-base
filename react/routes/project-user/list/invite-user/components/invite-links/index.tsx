/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { TimePopover, Loading } from '@choerodon/components';
import './index.less';
import { Button, message } from 'choerodon-ui/pro';
import CopyToClipboard from 'react-copy-to-clipboard';
import { projectsApi } from '@/api';

const prefixCls = 'c7ncd-invite-links';

type linkDataProps ={
  link: string,
  expiration:string
}

const InviteLinks = (props:any) => {
  const {
    modal,
  } = props;

  const [loading, setLoading] = useState<Boolean>(true);

  const [linkData, setLink] = useState<linkDataProps>({
    link: '',
    expiration: '',
  });

  const getLink = async (refresh?:boolean) => {
    setLoading(true);
    try {
      const res:linkDataProps = await (!refresh ? projectsApi.getLink() : projectsApi.refreshLink());
      setLoading(false);
      setLink(res);
    } catch (error) {
      throw new Error(error);
    }
  };

  function copyLink() {
    message.info('链接已复制到剪切板');
  }

  useEffect(() => {
    getLink();
  }, []);

  useEffect(() => {
    modal.update({
      okText: '复制链接',
      onOk: copyLink,
      footer: (okBtn:any, cancelBtn:any) => (
        <>
          {cancelBtn}
          <Button onClick={() => getLink(true)}>
            刷新
          </Button>
          <CopyToClipboard text={linkData.link}>
            {okBtn}
          </CopyToClipboard>
        </>
      ),
    });
  }, [linkData]);

  if (loading) {
    return <Loading type="c7n" />;
  }

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-content`}>
        <div>团队专属邀请链接，复制后分享给您好友，邀请他们加入，链接有效时间为10小时</div>
        <div>
          将在
          {/* <TimePopover content={linkData.expiration} /> */}
          {linkData?.expiration}
          失效
        </div>
      </div>
      <div className={`${prefixCls}-link`}>
        {linkData.link || '暂无链接'}
      </div>
    </div>
  );
};

export default InviteLinks;

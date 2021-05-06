import React, { ReactDOM } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from 'choerodon-ui/pro';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';

import './index.less';

export interface EmptyPageProps extends RouteComponentProps {
  pathname?: string,
  access?: boolean,
  title?: string,
  btnText?: string,
  describe?: string,
  onClick?(): void,
  className?: string,
  imgWidth?: string,
}

const EmptyPage = withRouter(((props: EmptyPageProps) => {
  const {
    history,
    location: { search },
    pathname,
    access,
    title,
    describe,
    btnText,
    onClick,
    className,
    imgWidth,
  } = props;

  function handleClick() {
    history.push({
      pathname,
      search,
    });
  }

  return (
    <div className={`c7ncd-empty-page-wrap ${className || ''}`}>
      <div
        className="c7ncd-empty-page"
        style={{
          width: imgWidth || 'unset',
          minWidth: imgWidth ? 'unset' : '4rem',
        }}
      >
        <div className={`c7ncd-empty-page-image c7ncd-empty-page-image-${access ? 'owner' : 'member'}`} />
        <div className="c7ncd-empty-page-text">
          <div className="c7ncd-empty-page-title">
            {title}
          </div>
          <div className="c7ncd-empty-page-des">
            {describe}
          </div>
          {(access && btnText) && (
            <Button
              color={'primary' as ButtonColor}
              onClick={onClick || handleClick}
              funcType={'raised' as FuncType}
            >
              {btnText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}));

EmptyPage.defaultProps = {
  pathname: '',
  access: false,
  btnText: '',
};

export default EmptyPage;

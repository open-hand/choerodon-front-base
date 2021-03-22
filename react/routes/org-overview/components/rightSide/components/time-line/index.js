import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './index.less';
import { Icon, Button, Tooltip } from 'choerodon-ui';
import { useOrgOverviewRightSide } from '../../stores';

// 点击展示更多
function handleDropDown(e) {
  const pNode = e.currentTarget.parentNode.parentNode.getElementsByTagName('p')[0]; // p元素
  const i = e.currentTarget.getElementsByClassName('icon')[0]; // btn的图标
  if (i.classList.contains('icon-expand_more')) {
    i.classList.remove('icon-expand_more');
    i.classList.add('icon-expand_less');
    pNode.style.setProperty('white-space', 'normal');
  } else {
    i.classList.remove('icon-expand_less');
    i.classList.add('icon-expand_more');
    pNode.style.setProperty('white-space', 'nowrap');
  }
}

function renderMonth(month) {
  let newMonth = month;
  switch (month) {
    case '01':
      newMonth = 'Jan';
      break;
    case '02':
      newMonth = 'Feb';
      break;
    case '03':
      newMonth = 'Mar';
      break;
    case '04':
      newMonth = 'Apr';
      break;
    case '05':
      newMonth = 'May';
      break;
    case '06':
      newMonth = 'Jun';
      break;
    case '07':
      newMonth = 'Jul';
      break;
    case '08':
      newMonth = 'Aug';
      break;
    case '09':
      newMonth = 'Sept';
      break;
    case '10':
      newMonth = 'Oct';
      break;
    case '11':
      newMonth = 'Nov';
      break;
    default:
      newMonth = 'Dec';
      break;
  }
  return newMonth;
}

const iconType = {
  addAdminUsers: {
    icon: 'account_circle',
    className: '',
    typeTxt: '分配root权限',
  },
  assignUsersRoles: {
    icon: 'account_circle',
    className: '',
    typeTxt: '分配角色',
  },
  createOrg: {
    icon: 'project_line',
    className: '',
    typeTxt: '创建组织',
  },
  unlockUser: {
    icon: 'account_circle',
    className: '',
    typeTxt: '解锁用户',
  },
  enableUser: {
    icon: 'account_circle',
    className: '',
    typeTxt: '启用用户',
  },
  disableUser: {
    icon: 'account_circle',
    className: 'disabled',
    typeTxt: '禁用用户',
  },
  deleteOrgAdministrator: {
    icon: 'account_circle',
    className: 'delete',
    typeTxt: '删除组织管理员角色',
  },
  createOrgAdministrator: {
    icon: 'account_circle',
    className: '',
    typeTxt: '添加组织管理员角色',
  },
  createProject: {
    icon: 'project_line',
    className: '',
    typeTxt: '创建项目',
  },
  enableProject: {
    icon: 'project_line',
    className: '',
    typeTxt: '启用项目',
  },
  disableProject: {
    icon: 'project_line',
    className: 'disabled',
    typeTxt: '禁用项目',
  },
  createUserOrg: {
    icon: 'account_circle',
    className: '',
    typeTxt: '创建用户',
  },
  orgRetry: {
    icon: 'ballot',
    className: '',
    typeTxt: '重试事务',
  },
  resetUserPassword: {
    icon: 'password',
    className: '',
    typeTxt: '重置密码',
  },
};

const TimeLine = observer(() => {
  const {
    optsDs,
    overStores,
  } = useOrgOverviewRightSide();

  const [isMore, setLoadMoreBtn] = useState(false);

  const record = optsDs.current && optsDs.toData();

  // 加载记录
  async function loadData(page = 1) {
    const res = await optsDs.query(page);
    const records = overStores.getOldOptsRecord;
    if (res && !res.failed) {
      if (!res.isFirstPage) {
        optsDs.unshift(...records);
      }
      overStores.setOldOptsRecord(optsDs.records);
      setLoadMoreBtn(res.hasNextPage);
      return res;
    }
    return false;
  }
  // 更多操作
  function loadMoreOptsRecord() {
    loadData(optsDs.currentPage + 1);
  }

  /* eslint-disable no-shadow */
  /* eslint-disable wrap-iife */
  /* eslint-disable no-loop-func */
  useEffect(() => {
    const flow = document.getElementsByClassName('c7n-poverflow');
    if (flow && flow.length > 0) {
      for (let i = 0; i < flow.length; i += 1) {
        new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const pDom = entry.target;
            const scrollW = Math.ceil(pDom.scrollWidth);
            const width = Math.ceil(pDom.clientWidth);
            if (scrollW > width) {
              optsDs.records[i].set('display', 'block');
            }
          });
        }).observe(flow[i]);
      }
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  function renderDateLine(date) {
    const dateArr = date && date.split('-');
    const month = renderMonth(dateArr[1]);
    return (
      <Tooltip title={date}>
        <div className="c7ncd-timeLine-date">
          <span>{dateArr[2].split(' ')[0]}</span>
          <span>{month}</span>
        </div>
      </Tooltip>
    );
  }

  function renderData() {
    return record ? (
      <ul>
        {
          record.map((item) => {
            const {
              logId: id, auditDatetime: creationDate, type, auditContent: content,
            } = item;
            return (
              <li key={id}>
                {renderDateLine(creationDate)}
                <div className="c7ncd-timeLine-content">
                  <div className="c7ncd-timeLine-content-header">
                    <div className="c7ncd-timeLine-content-header-icon">
                      <Icon type={iconType[type]?.icon} className={iconType[type]?.className} />
                    </div>
                    <span className="c7ncd-timeLine-content-header-title">{iconType[type]?.typeTxt}</span>
                    <Button
                      className="c7ncd-timeLine-content-header-btn"
                      shape="circle"
                      funcType="flat"
                      style={{ display: item.display }}
                      icon="expand_more"
                      type="primary"
                      size="small"
                      onClick={handleDropDown}
                    />
                  </div>
                  <Tooltip placement="top" title={content}>
                    <p className="c7n-poverflow">{content}</p>
                  </Tooltip>
                </div>
                <div className="c7ncd-timeLine-border">
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </li>
            );
          })
        }
      </ul>
    ) : null;
  }

  return (
    <div className="c7ncd-timeLine">
      {
        record && record.length > 0 ? (
          <div className="c7ncd-timeLine-body">
            {renderData()}
          </div>
        ) : <span className="c7ncd-timeLine-empty">暂无更多记录...</span>
      }
      {isMore && <Button type="primary" onClick={loadMoreOptsRecord}>加载更多</Button>}
    </div>
  );
});

export default TimeLine;

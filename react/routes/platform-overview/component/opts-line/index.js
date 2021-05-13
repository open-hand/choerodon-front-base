import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './index.less';
import { Icon, Button, Tooltip } from 'choerodon-ui';
import { usePlatformOverviewStore } from '../../stores';

const iconType = {
  addAdminUsers: {
    icon: 'account_circle',
    className: '',
    typeTxt: '分配root权限',
  },
  assignUserRole: {
    icon: 'account_circle',
    className: '',
    typeTxt: '分配权限',
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
  enableOrganization: {
    icon: 'project_line',
    className: '',
    typeTxt: '启用组织',
  },
  disableOrganization: {
    icon: 'project_line',
    className: 'disabled',
    typeTxt: '停用组织',
  },
  updateOrganization: {
    icon: 'project_line',
    className: '',
    typeTxt: '平台层修改组织信息',
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
  registersApproval: {
    icon: 'filter_frames',
    className: '',
    typeTxt: '审批注册',
  },
  siteRetry: {
    icon: 'ballot',
    className: '',
    typeTxt: '重试事务',
  },
};

const OptsLine = observer(() => {
  const {
    optsDs,
    platOverStores,
    renderMonth,
  } = usePlatformOverviewStore();

  const scorllRef = useRef();

  const [isMore, setLoadMoreBtn] = useState(false);

  const record = optsDs.current && optsDs.toData();

  function renderId(id) {
    const type = typeof id;
    if (type === 'string') {
      return id.slice(3, 6);
    } if (type === 'number') {
      return String(id).slice(3, 6);
    }
    return id;
  }

  // 加载记录
  async function loadData(page = 1) {
    const res = await optsDs.query(page);
    const records = platOverStores.getOldOptsRecord;
    if (res && !res.failed) {
      if (!res.isFirstPage) {
        optsDs.unshift(...records);
      }
      platOverStores.setOldOptsRecord(optsDs.records);
      const lastRecord = optsDs.records[optsDs.records.length - 1];
      const getDom = document.querySelector(`#optNotice-${renderId(lastRecord.get('logId'))}`);
      if (getDom && !res.isFirstPage) {
        const parent = scorllRef.current;
        parent.scrollTo({
          behavior: 'smooth',
          top: parent.scrollHeight,
        });
      }
      setLoadMoreBtn(res.hasNextPage);
      return res;
    }
    return false;
  }
  // 更多操作
  function loadMoreOptsRecord() {
    loadData(optsDs.currentPage + 1);
  }

  useEffect(() => {
    loadData();
  }, []);

  function renderDateLine(date) {
    const dateArr = date && date.split('-');
    const month = dateArr && dateArr.length > 0 && renderMonth(dateArr[1]);
    return (
      <Tooltip title={date}>
        <div className="c7ncd-opts-timeLine-date">
          {
            dateArr && dateArr.length > 0 ? [
              <span>{dateArr[2].split(' ')[0]}</span>,
              <span>{month}</span>,
            ] : '无'
          }
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
              <li key={id} id={`optNotice-${renderId(id)}`}>
                {renderDateLine(creationDate)}
                <div className="c7ncd-opts-timeLine-content">
                  <div className="c7ncd-opts-timeLine-content-header">
                    <div className="c7ncd-opts-timeLine-content-header-icon">
                      <Icon type={iconType[type]?.icon} className={iconType[type]?.className} />
                    </div>
                    <span className="c7ncd-opts-timeLine-content-header-title">{iconType[type]?.typeTxt}</span>
                  </div>
                  <Tooltip placement="top" title={content}>
                    <p className="c7n-pOverflow">{content}</p>
                  </Tooltip>
                </div>
                <div className="c7ncd-opts-timeLine-border">
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
    <div className="c7ncd-opts-timeLine">
      {record && record.length > 0 ? (
        <div className="c7ncd-opts-timeLine-body" ref={scorllRef}>
          {renderData()}
        </div>
      ) : <span className="c7ncd-opts-timeLine-empty">暂无更多记录...</span>}

      {isMore && <Button disabled={optsDs.status === 'loading'} loading={optsDs.status === 'loading'} type="primary" onClick={loadMoreOptsRecord}>加载更多</Button>}
    </div>
  );
});

export default OptsLine;

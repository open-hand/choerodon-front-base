import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './index.less';
import { Icon, Button, Tooltip } from 'choerodon-ui';
import { C7NFormatCommon, C7NFormat } from '@choerodon/master';
import { usePlatformOverviewStore } from '../../stores';

const OptsLine = observer(() => {
  const {
    optsDs,
    platOverStores,
    renderMonth,
    format,
    formatCommon,
  } = usePlatformOverviewStore();
  const iconType = {
    addAdminUsers: {
      icon: 'account_circle',
      className: '',
      typeTxt: formatCommon({ id: 'assignRootPermission' }),
    },
    assignUserRole: {
      icon: 'account_circle',
      className: '',
      typeTxt: formatCommon({ id: 'assignPermissions' }),
    },
    assignUsersRoles: {
      icon: 'account_circle',
      className: '',
      typeTxt: formatCommon({ id: 'assignRoles' }),
    },
    createOrg: {
      icon: 'project_line',
      className: '',
      typeTxt: formatCommon({ id: 'createOrganization' }),
    },
    enableOrganization: {
      icon: 'project_line',
      className: '',
      typeTxt: formatCommon({ id: 'enableOrganization' }),
    },
    disableOrganization: {
      icon: 'project_line',
      className: 'disabled',
      typeTxt: formatCommon({ id: 'stopOrganization' }),
    },
    updateOrganization: {
      icon: 'project_line',
      className: '',
      typeTxt: format({ id: 'editOrganizationInfo' }),
    },
    unlockUser: {
      icon: 'account_circle',
      className: '',
      typeTxt: formatCommon({ id: 'unlockUser' }),
    },
    enableUser: {
      icon: 'account_circle',
      className: '',
      typeTxt: formatCommon({ id: 'enableUser' }),
    },
    disableUser: {
      icon: 'account_circle',
      className: 'disabled',
      typeTxt: formatCommon({ id: 'disableUser' }),
    },
    deleteOrgAdministrator: {
      icon: 'account_circle',
      className: 'delete',
      typeTxt: formatCommon({ id: 'deleteOrganizationAdminRole' }),
    },
    createOrgAdministrator: {
      icon: 'account_circle',
      className: '',
      typeTxt: formatCommon({ id: 'addOrganizationAdminRole' }),
    },
    createProject: {
      icon: 'project_line',
      className: '',
      typeTxt: formatCommon({ id: 'createProject' }),
    },
    enableProject: {
      icon: 'project_line',
      className: '',
      typeTxt: formatCommon({ id: 'enableProject' }),
    },
    disableProject: {
      icon: 'project_line',
      className: 'disabled',
      typeTxt: formatCommon({ id: 'disableProject' }),
    },
    createUserOrg: {
      icon: 'account_circle',
      className: '',
      typeTxt: formatCommon({ id: 'createUser' }),
    },
    registersApproval: {
      icon: 'filter_frames',
      className: '',
      typeTxt: formatCommon({ id: 'approvalRegister' }),
    },
    siteRetry: {
      icon: 'ballot',
      className: '',
      typeTxt: format({ id: 'retryTransaction' }),
    },
  };
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
  const loadMoreOptsRecord = () => {
    loadData(optsDs.currentPage + 1);
  };

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
      ) : <span className="c7ncd-opts-timeLine-empty">{format({ id: 'noMoreRecods' })}</span>}

      {isMore && <Button disabled={optsDs.status === 'loading'} loading={optsDs.status === 'loading'} type="primary" onClick={loadMoreOptsRecord}>{formatCommon({ id: 'loadMore' })}</Button>}
    </div>
  );
});

export default OptsLine;

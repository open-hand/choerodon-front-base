import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from 'choerodon-ui/pro';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { ButtonGroup } from '@choerodon/master';
import InviteForm from './components/invite-form';
import Store from './stores';
import InviteLinks from './components/invite-links';
import './index.less';

const modalKey = Modal.key();

export default inject('AppState')(
  observer((props) => {
    const {
      orgInfoDataSet,
      inviteUserDataSet,
      inviteStore: { getCanCreate },
    } = useContext(Store);

    const { AppState } = props;

    const [createBtnToolTipHidden, setCreateBtnToolTipHidden] = useState(true);
    const [inNewUserGuideStepTwo, setInNewUserGuideStepTwo] = useState(false);

    useEffect(() => {
      if (
        AppState.getUserWizardStatus
        && AppState.getUserWizardStatus[1].status === 'uncompleted'
      ) {
        setInNewUserGuideStepTwo(true);
        setTimeout(() => {
          setCreateBtnToolTipHidden(false);
        }, 1000);
      } else {
        setInNewUserGuideStepTwo(false);
        setCreateBtnToolTipHidden(true);
      }
    }, [AppState.getUserWizardStatus]);

    const toHelpDoc = () => {
      window.open(
        `${AppState?.getUserWizardStatus[1]?.helpDocs[0]}`,
        '_blank',
      );
    };

    const onHiddenBeforeChange = (hidden) => {
      if (inNewUserGuideStepTwo && createBtnToolTipHidden === true && !hidden) {
        setCreateBtnToolTipHidden(hidden);
      }
    };

    const getCreatBtnTitle = () => {
      if (inNewUserGuideStepTwo) {
        return (
          <div style={{ background: '#6E80F1 !important' }}>
            <div style={{ padding: 8 }}>
              邀请更多的小伙伴加入项目进行协作即刻开启团队高效协作体验。
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setCreateBtnToolTipHidden(true);
                }}
                style={{ color: '#fff', background: '#7E90F1' }}
              >
                忽略
              </Button>
              <Button
                onClick={toHelpDoc}
                style={{ color: '#5365EA', background: '#fff' }}
              >
                查看
              </Button>
            </div>
          </div>
        );
      }
      return '';
    };

    async function handleInviteUser() {
      await orgInfoDataSet.query();
      inviteUserDataSet.create({ roleId: [''] });

      Modal.open({
        okText: '邀请',
        title: '邀请组织成员',
        children: (
          <InviteForm
            {...props}
            orgInfoDataSet={orgInfoDataSet}
            inviteUserDataSet={inviteUserDataSet}
          />
        ),
        key: modalKey,
        drawer: true,
        style: { width: 380 },
        fullScreen: true,
        destroyOnClose: true,
        className: 'base-project-user-sider',
      });
    }

    async function openInviteLinks() {
      Modal.open({
        title: '邀请成员',
        children: <InviteLinks />,
        key: modalKey,
      });
    }

    const popoverVisibleChange = (visible) => {
      if (visible) {
        setCreateBtnToolTipHidden(true);
      }
    };

    return (
      <ButtonGroup
        tooltipsConfig={{
          popupClassName: inNewUserGuideStepTwo ? 'c7n-pro-popup-invite-user-guide' : '',
          hidden: createBtnToolTipHidden,
          onHiddenBeforeChange,
          title: getCreatBtnTitle,
          placement: inNewUserGuideStepTwo ? 'bottomRight' : 'bottom',
        }}
        popoverVisibleChange={popoverVisibleChange}
        name="邀请成员"
        btnItems={[
          {
            name: '邮件邀请成员',
            permissions: [
              'choerodon.code.project.cooperation.team-member.ps.invite',
            ],
            disabled: !getCanCreate,
            tooltipsConfig: {
              title: getCanCreate
                ? ''
                : '组织用户数量已达上限，无法邀请更多用户',
            },
            handler: handleInviteUser,
          },
          {
            name: '链接邀请成员',
            permissions: [
              'choerodon.code.project.cooperation.team-member.ps.invite_link',
            ],
            disabled: !getCanCreate,
            tooltipsConfig: {
              title: getCanCreate
                ? ''
                : '组织用户数量已达上限，无法邀请更多用户',
            },
            handler: openInviteLinks,
          },
        ]}
      />
    );
  }),
);

import React, { useContext } from 'react';
import { Modal } from 'choerodon-ui/pro';
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
    } = useContext(Store);

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

    return (
      <ButtonGroup
        name="邀请成员"
        btnItems={[
          {
            name: '邮件邀请成员',
            handler: handleInviteUser,
          },
          {
            name: '链接邀请成员',
            handler: openInviteLinks,
          },
        ]}
      />
    );
  }),
);

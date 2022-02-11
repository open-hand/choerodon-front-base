// @ts-nocheck
import React, {
  useCallback, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import {
  Form, TextField, Tooltip, Spin, Icon, Button, DatePicker, TextArea,
} from 'choerodon-ui/pro';
import { notification } from 'choerodon-ui';
import { map, some, isEmpty } from 'lodash';
import { axios, Choerodon } from '@choerodon/boot';
import ProjectNotification from '@choerodon/master/lib/containers/components/c7n/routes/projectsPro/components/create-project/components/project-notification';
import AvatarUploader from '../../../../components/avatarUploader';
import { useCreateProjectProStore } from './stores';
import { LabelLayoutType, Record } from '../../../../interface';

import './index.less';

const EditProject = observer(() => {
  const {
    formDs, categoryDs, AppState, intl, prefixCls, modal, refresh, categoryCodes,
    intl: { formatMessage }, intlPrefix,
    showProjectPrefixArr,
    isShowAgilePrefix,
    isShowTestPrefix,
    isWATERFALL,
    editProjectStore,
    projectId,
    organizationId,
    standardDisable,
  } = useCreateProjectProStore();
  const [isShowAvatar, setIsShowAvatar] = useState(false);

  const record = useMemo(() => formDs.current, [formDs.current]);

  modal.handleOk(async () => {
    try {
      if (!record) {
        return false;
      }
      const selectedRecords = categoryDs.selected;
      if (!selectedRecords || !selectedRecords.length) {
        Choerodon.prompt('请至少选择一个项目类型');
        return false;
      }
      const categories = map(selectedRecords, (selectedRecord: Record) => ({
        id: selectedRecord.get('id'),
        code: selectedRecord.get('code'),
      }));
      record.set('categories', categories);
      const postData = record.toData();
      // @ts-ignore
      const {
        agileProjectCode, testProjectCode, testProjectInfoId, testProjectObjectVersionNumber,
      } = postData || {};
      const [res] = await axios.all([formDs.submit(),
        isWATERFALL ? editProjectStore.axiosUpdateWaterfallProjectInfo({
          ...postData,
          projectCode: agileProjectCode,
        }) : undefined,
        isShowAgilePrefix && agileProjectCode !== record.getPristineValue('agileProjectCode')
          ? editProjectStore.axiosUpdateAgileProjectInfo(postData)
          : undefined,
        isShowTestPrefix && testProjectCode !== record.getPristineValue('testProjectCode')
          ? editProjectStore.axiosUpdateTestProjectInfo({
            projectId,
            testProjectInfoId,
            projectCode: testProjectCode,
            testProjectObjectVersionNumber,
          })
          : undefined,
      ]);
      if (res === false) {
        return false;
      }
      openNotification();
      refresh();
      return true;
    } catch (e) {
      Choerodon.handleResponseError(e);
      return false;
    }
  });

  const openNotification = useCallback(() => {
    const notificationKey = `${organizationId}-${projectId}`;
    notification.open({
      key: notificationKey,
      message: <span className="c7ncd-project-create-notification-title">修改项目</span>,
      description: <ProjectNotification
        notificationKey={notificationKey}
        organizationId={organizationId}
        projectId={projectId}
        operateType="update"
        formatMessage={formatMessage}
        intlPrefix={intlPrefix}
        refresh={refresh}
      />,
      duration: null,
      placement: 'bottomLeft',
      className: 'c7ncd-project-create-notification',
    });
  }, []);

  const changeAvatarUploader = useCallback((flag) => {
    setIsShowAvatar(flag);
  }, []);

  const handleUploadOk = useCallback((res) => {
    record && record.set('imageUrl', res);
    changeAvatarUploader(false);
  }, [record]);

  const handleCategoryClick = useCallback((categoryRecord) => {
    if (categoryRecord.getState('disabled')) {
      return;
    }
    if (categoryRecord.get('code') === categoryCodes.require) {
      categoryRecord.setState('isEdit', true);
    }
    if (categoryRecord.isSelected) {
      categoryDs.unSelect(categoryRecord);
    } else {
      categoryDs.select(categoryRecord);
    }
  }, []);

  const renderAvatar = useCallback(() => {
    if (!record) {
      return <Spin spinning />;
    }
    const name = record.get('name');
    const imageUrl = record.get('imageUrl');

    return (
      <>
        <div className={`${prefixCls}-avatar`}>
          <div
            className={`${prefixCls}-avatar-wrap`}
            style={{
              backgroundColor: '#c5cbe8',
              backgroundImage: imageUrl ? `url('${Choerodon.fileServer(imageUrl)}')` : '',
            }}
          >
            {!imageUrl && name && name.charAt(0)}
            <Button
              className={classnames(`${prefixCls}-avatar-button`, `${prefixCls}-avatar-button-edit`)}
              onClick={() => changeAvatarUploader(true)}
            >
              <div className={`${prefixCls}-avatar-button-icon`}>
                <Icon type="photo_camera" />
              </div>
            </Button>
            <AvatarUploader
              AppState={AppState}
              intl={intl}
              visible={isShowAvatar}
              intlPrefix="organization.project.avatar.edit"
              onVisibleChange={() => changeAvatarUploader(false)}
              onUploadOk={handleUploadOk}
            />
          </div>
        </div>
        <div style={{ margin: '.06rem 0 .2rem 0', textAlign: 'center' }}>项目logo</div>
      </>
    );
  }, [record, isShowAvatar, AppState]);

  const getCategoryClassNames = useCallback((categoryRecord) => (classnames({
    [`${prefixCls}-category-item`]: true,
    [`${prefixCls}-category-item-disabled`]: categoryRecord.getState('disabled'),
    [`${prefixCls}-category-item-selected`]: categoryRecord.isSelected,
  })), []);

  const getTooltipContent = useCallback((categoryRecord) => {
    const code = categoryRecord.get('code');
    if (!categoryRecord.getState('disabled')) {
      return '';
    }
    if (!editProjectStore.getIsSenior && standardDisable.includes(code)) {
      return '仅SaaS高级版可选此项目类型';
    }
    if (code === categoryCodes.require) {
      return '请先选择【敏捷管理】或【敏捷项目群】项目类型';
    }
    if (categoryRecord.isSelected) {
      if (code === categoryCodes.program) {
        return '项目群中存在子项目，无法移除此项目类型';
      }
      if (code === categoryCodes.agile) {
        return '敏捷管理项目已加入项目群，无法移除此项目类型';
      }
    } else {
      if (code === categoryCodes.program) {
        return '已添加或添加过【敏捷管理】项目类型，不可添加【敏捷项目群】项目类型';
      }
      if (code === categoryCodes.agile) {
        return '原项目曾经为【敏捷项目群】项目，不支持调整为【敏捷管理】类型';
      }
      return '不可同时选择【敏捷管理】与【规模化敏捷项目群】项目类型';
    }
    return '';
  }, []);

  if (!record) {
    return <Spin spinning />;
  }

  return (
    <>
      <div className={`${prefixCls}-section-title`}>
        {formatMessage({ id: `${intlPrefix}.setting` })}
      </div>
      {renderAvatar()}
      <Form record={record} className={`${prefixCls}-form`} labelLayout={'float' as LabelLayoutType}>
        <TextField name="name" />
        <TextArea name="description" resize="vertical" />
      </Form>
      <div className={`${prefixCls}-category-label`}>项目类型</div>
      <Spin spinning={categoryDs.status === 'loading'}>
        <div className={`${prefixCls}-category`}>
          {categoryDs.map((categoryRecord) => (
            <Tooltip title={getTooltipContent(categoryRecord)} key={categoryRecord.get('code')}>
              <div
                className={getCategoryClassNames(categoryRecord)}
                onClick={() => handleCategoryClick(categoryRecord)}
                role="none"
              >
                <div className={`${prefixCls}-category-item-icon ${prefixCls}-category-item-icon-${categoryRecord.get('code')}`} />
                <span>{categoryRecord.get('name')}</span>
              </div>
            </Tooltip>
          ))}
        </div>
      </Spin>
      {(!isEmpty(showProjectPrefixArr) || isWATERFALL) && ([
        <div className={`${prefixCls}-section-title`}>
          {formatMessage({ id: `${intlPrefix}.otherSetting` })}
        </div>,
        <Form dataSet={formDs} className={`${prefixCls}-form`} labelLayout={'float' as LabelLayoutType}>
          {isShowAgilePrefix && <TextField name="agileProjectCode" renderer={({ value }) => (isWATERFALL ? record.get('projectCode') : value)} />}
          {isShowTestPrefix && <TextField name="testProjectCode" />}
          {isWATERFALL && ([
            <DatePicker
              name="projectEstablishmentTime"
              autoComplete="off"
            />,
            <DatePicker
              name="projectConclusionTime"
              autoComplete="off"
            />,
          ])}
        </Form>,
      ])}
    </>
  );
});

export default EditProject;

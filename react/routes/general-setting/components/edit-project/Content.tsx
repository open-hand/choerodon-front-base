// @ts-nocheck
import React, {
  useCallback, useMemo, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { NewTips } from '@choerodon/components';
import {
  Form, TextField, Tooltip, Spin, Icon, Button, TextArea, CheckBox, Select,
} from 'choerodon-ui/pro';
import { notification } from 'choerodon-ui';
import { map, forEach } from 'lodash';
import { axios, Choerodon } from '@choerodon/boot';
import ProjectNotification from '@choerodon/master/lib/containers/components/c7n/routes/projectsPro/components/create-project/components/project-notification';
import AvatarUploader from '../../../../components/avatarUploader';
import { useCreateProjectProStore } from './stores';
import { LabelLayoutType, Record } from '../../../../interface';

import './index.less';

const EditProject = observer((props:any) => {
  const {
    formDs, categoryDs, AppState, intl, prefixCls, modal, refresh, categoryCodes, infoDs,
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

      if (typeof formDs?.current?.get('statusId') === 'object') {
        formDs?.current?.set('statusId', formDs?.current?.get('statusId')?.id);
      }
      record.set('categories', categories);
      const postData = record.toData();
      // @ts-ignore
      const {
        agileProjectCode, testProjectCode, testProjectInfoId, testProjectObjectVersionNumber,
      } = postData || {};
      const [res] = await axios.all([formDs.submit(),
        // isWATERFALL ? editProjectStore.axiosUpdateWaterfallProjectInfo({
        //   ...postData,
        //   projectCode: agileProjectCode,
        // }) : undefined,
        exist(['N_AGILE', 'N_PROGRAM', 'N_WATERFALL']) && agileProjectCode !== record.getPristineValue('agileProjectCode')
          ? editProjectStore.axiosUpdateAgileProjectInfo(postData)
          : undefined,
        exist(['N_TEST']) && testProjectCode !== record.getPristineValue('testProjectCode')
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
    formDs?.setState('category', categoryDs.selected);
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
    const isModify = true;
    const code = categoryRecord.get('code');
    if (!categoryRecord.getState('disabled')) {
      return '';
    }
    if (!editProjectStore.getIsSenior && standardDisable.includes(code)) {
      return '仅SaaS企业版可选此项目类型';
    }
    if (code === categoryCodes.require) {
      return '请先选择【敏捷管理】或【敏捷项目群】项目类型';
    }
    if (categoryRecord.isSelected) {
      if (code === categoryCodes.program && isModify) {
        return '项目群中存在子项目，无法移除此项目类型';
      }
      if (code === categoryCodes.agile && isModify) {
        return '敏捷管理项目已加入项目群，无法移除此项目类型';
      }
    } else {
      if (code === categoryCodes.agile && isModify && categoryDs.getState('isWaterfall')) {
        return '已添加或添加过【瀑布管理】项目类型，不可添加【敏捷管理】项目类型';
      }
      if (code === categoryCodes.program && isModify && categoryDs.getState('isWaterfall')) {
        return '已添加或添加过【瀑布管理】项目类型，不可添加【敏捷项目群】项目类型';
      }
      if (code === categoryCodes.waterfall && isModify && categoryDs.getState('isAgile') || categoryDs.getState('isProgram')) {
        return '已添加或添加过【敏捷管理】/【敏捷项目群】项目类型，不可添加【瀑布管理】项目类型';
      }
      if (code === categoryCodes.program && isModify) {
        return '已添加或添加过【敏捷管理】项目类型，不可添加【敏捷项目群】项目类型';
      }
      if (code === categoryCodes.agile && isModify) {
        return '原项目曾经为【敏捷项目群】项目，不支持调整为【敏捷管理】类型';
      }
      if ([categoryCodes.program, categoryCodes.waterfall, categoryCodes.agile]
        .indexOf(code) !== -1) {
        return '不可同时选择敏捷管理/敏捷项目群与瀑布管理项目类型';
      }
      return '不可同时选择【敏捷管理】与【规模化敏捷项目群】项目类型';
    }
    return '';
  }, [editProjectStore.getIsSenior]);

  const sprintCheckboxOnChange = (value) => {
    formDs?.current?.set('agileWaterfall', value);
  };

  const exist = useCallback((codeArr:any) => {
    let bool = false;
    forEach(codeArr, (value, key) => {
      const index = categoryDs?.selected?.findIndex((item) => item?.get('code') === value);
      if (index !== -1) {
        bool = true;
      }
    });
    return bool;
  }, [categoryDs.selected]);

  const renderStatus = ({ record: hereRecord, value, text }) => {
    const arr = hereRecord?.getField('statusId')?.options?.toData();
    const index = arr.findIndex((item) => item.id === hereRecord?.get('statusId')?.id);
    if (index === -1) {
      return hereRecord?.get('statusName');
    }
    return text;
  };

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
        <Select name="statusId" renderer={renderStatus} />
        <TextArea name="description" resize="vertical" />
      </Form>
      <div className={`${prefixCls}-category-label`}>项目类型</div>
      <Spin spinning={categoryDs.status === 'loading'}>
        <div className={`${prefixCls}-category`}>
          {categoryDs.map((categoryRecord) => (
            <div>
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
              {categoryRecord.get('code') === 'N_WATERFALL'
              && categoryRecord.isSelected && (
              <div
                role="none"
                className={`${prefixCls}-category-exception`}
                onClick={(e) => { e.stopPropagation(); }}
              >
                同时启用冲刺
                {' '}
                <CheckBox checked={record?.get('agileWaterfall')} onChange={sprintCheckboxOnChange} />
                <NewTips
                  helpText="启用冲刺适用于大瀑布小敏捷场景， 启用后可使用任务看板，故事地图等功能"
                  style={{
                    marginLeft: 6,
                    position: 'relative',
                  }}
                />
              </div>
              )}
            </div>
          ))}
        </div>
      </Spin>
      {/* (!isEmpty(showProjectPrefixArr) || isWATERFALL) */}
      {/* exist(['N_AGILE', 'N_PROGRAM', 'N_TEST', 'N_WATERFALL']) &&  */}
      {exist(['N_AGILE', 'N_PROGRAM', 'N_TEST', 'N_WATERFALL']) && ([
        <div className={`${prefixCls}-section-title`}>
          {formatMessage({ id: `${intlPrefix}.otherSetting` })}
        </div>,
        <Form dataSet={formDs} className={`${prefixCls}-form`} labelLayout={'float' as LabelLayoutType}>
          {/* {isWATERFALL || isShowAgilePrefix && <TextField name="agileProjectCode" />}
          {isShowTestPrefix && <TextField name="testProjectCode" />} */}
          {exist(['N_AGILE', 'N_PROGRAM', 'N_WATERFALL']) && (
          <TextField
            valueChangeAction="input"
            name="agileProjectCode"
          />
          )}
          {exist(['N_TEST']) && <TextField name="testProjectCode" valueChangeAction="input" />}
        </Form>,
      ])}
    </>
  );
});

export default EditProject;

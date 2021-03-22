import React, { Component, useState, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Form, Icon, Input, Modal, Select } from 'choerodon-ui';
import { axios, Content, Header, TabPage as Page, Breadcrumb, Permission, stores, Choerodon } from '@choerodon/boot';
import { FormattedMessage, injectIntl } from 'react-intl';
import classnames from 'classnames';
import ApplicationSettingContext from '../../stores';
import AvatarUploader from '../../../../components/avatarUploader';
import './index.less';

const { Sidebar } = Modal;
const FormItem = Form.Item;

const Edit = Form.create({})(observer(({
  onCancel, 
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
    setFieldsValue,
  },
  visible,
  categoryEnabled,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  const { store, AppState, intl: { formatMessage }, intlPrefix, prefixCls } = useContext(ApplicationSettingContext);
  const { id: projectId } = AppState.currentMenuType;
  useEffect(() => {
    if (visible) {
      const { enabled, name, code, agileApplicationCode, categories, applicationVO = {} } = store.getApplicationInfo;
      setFieldsValue({
        name,
        agileApplicationCode,
        applicationName: applicationVO.name,
      });
    }
  }, [visible]);
  /**
   * 打开上传图片模态框
   */
  const openAvatarUploader = () => {
    setIsShowAvatar(true);    
  };

  /**
   * 关闭上传图片模态框
   * @param visible 模态框是否可见
   */
  const closeAvatarUploader = () => {
    setIsShowAvatar(false);  
  };

  const handleUploadOk = (res) => {
    store.setImageUrl(res);
    setIsShowAvatar(false); 
  };
  const getAvatar = () => {
    const { name } = store.getApplicationInfo;
    const imageUrl = store.getImageUrl;
    return (
      <div className={`${prefixCls}-avatar`} style={{ boxShadow: 'none', margin: 'auto' }}>
        <div
          className={`${prefixCls}-avatar-wrap`}
          style={{
            backgroundImage: imageUrl ? `url(${Choerodon.fileServer(imageUrl)})` : '',
            height: 80,
            width: 80,
            lineHeight: '80px',
          }}
        >
          {!imageUrl && name && name.charAt(0)}
          <Button
            className={classnames(`${prefixCls}-avatar-button`, `${prefixCls}-avatar-button-edit`)}
            onClick={openAvatarUploader}
          >
            <div
              className={`${prefixCls}-avatar-button-icon`}
              style={{
                height: 80,
                width: 80,
                lineHeight: '77px',
              }}
            >
              <Icon type="photo_camera" />
            </div>
          </Button>
          <AvatarUploader
            visible={isShowAvatar}
            title={formatMessage({ id: `${intlPrefix}.avatar.edit.title` })}
            intlPrefix="organization.project.avatar.edit"
            onVisibleChange={closeAvatarUploader}
            onUploadOk={handleUploadOk}
          />
        </div>
      </div>
    );
  };

  const cancelValue = () => {
    const { imageUrl } = store.getApplicationInfo;
    store.setImageUrl(imageUrl);
    resetFields();
    onCancel();
  };


  const handleSave = (e) => {
    e.preventDefault();    
    validateFields((err, value, modify) => {
      if (!err) {
        if (store.getApplicationInfo.imageUrl !== store.getImageUrl) modify = true;
        if (!modify) {
          Choerodon.prompt(formatMessage({ id: 'save.success' }));
          onCancel();
          return;
        }    
        const { id } = store.getApplicationInfo;
        const body = {     
          ...value,          
          imageUrl: store.getImageUrl,
        };
        if (body.category) {
          body.category = null;
        }
        body.type = body.type === 'no' || undefined ? null : value.type;
        setSubmitting(true);
        store.axiosSaveApplicationInfo(projectId, id, body)
          .then(() => {
            setSubmitting(false);
            Choerodon.prompt(formatMessage({ id: 'save.success' }));            
            store.axiosGetApplicationInfo(projectId).then((data) => {
              store.setImageUrl(data.imageUrl);
              store.setApplicationInfo(data);              
            }).catch(Choerodon.handleResponseError);            
            onCancel();
            // history.replace(`${location.pathname}?type=project&id=${id}&name=${encodeURIComponent(data.name)}&organizationId=${organizationId}`);
          })
          .catch((error) => {
            setSubmitting(false);
            Choerodon.handleResponseError(error);
          });
      }
    });
  };


  const { enabled, name, code, agileApplicationCode, categories, applicationVO = {} } = store.getApplicationInfo;
  return (
    <Sidebar
      title={formatMessage({ id: `${intlPrefix}.modal.title` })}
      className={`${prefixCls}-modal-edit`}
      visible={visible}
      width={380}
      footer={(
        <div className="btnGroup">
          <Button
            funcType="raised"
            type="primary"
            onClick={handleSave}
            loading={submitting}       
          ><FormattedMessage id="save" />
          </Button>
          <Button
            funcType="raised"
            onClick={cancelValue}       
          >
            <FormattedMessage id="cancel" />
          </Button>
        </div>
      )}
    >
      <Form>
        <div className={`${prefixCls}-section-title`}>
          {formatMessage({ id: `${intlPrefix}.title` })}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          {getAvatar()}
          <span style={{ color: 'rgba(0,0,0,.6)' }}>{formatMessage({ id: `${intlPrefix}.avatar` })}</span>
        </div>
        <FormItem>
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              whitespace: true,
              message: formatMessage({ id: `${intlPrefix}.namerequiredmsg` }),
            }, {
              /* eslint-disable-next-line */
              pattern: /^[-—\.\w\s\u4e00-\u9fa5]{1,32}$/,
              message: formatMessage({ id: `${intlPrefix}.name.pattern.msg` }),
            }],
            initialValue: name,
          })(
            <Input
              autoComplete="off"
              label={<FormattedMessage id={`${intlPrefix}.name`} />}            
              maxLength={32}
              showLengthInfo={false}
            />,
          )}
        </FormItem>        
      </Form>
    </Sidebar>
  );
}));
export default Edit;

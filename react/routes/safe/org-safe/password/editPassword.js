/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form, Select, SelectBox, NumberField, TextField, Tooltip, Output, Button, Modal,
} from 'choerodon-ui/pro';
import { Divider, Icon } from 'choerodon-ui';

import SecondCheckModal, { getSecondCheckModalDataSet } from './SecondCheckModal';
import '../index.less';

const { Option } = Select;

const getHelpLabel = (label, help) => (
  <span style={{ display: 'flex', alignItems: 'center' }}>
    {label}
    <Tooltip title={help}>
      <Icon type="help" className="c7ncd-base-help-icon" style={{ pointerEvents: 'auto' }} />
    </Tooltip>
  </span>
);

export default observer(({
  dataSet, onCancel, onOk, modal, organizationId,
}) => {
  const { current } = dataSet;

  modal.handleOk(handleOk);
  modal.handleCancel(handleCancel);

  async function handleOk() {
    if (!current.dirty) {
      return true;
    }
    try {
      if (await dataSet.submit()) {
        await dataSet.query();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
  function handleCancel() {
    dataSet.reset();
  }
  function getSecurity() {
    const ret = [];
    if (current && current.get('enableSecurity')) {
      ret.push(
        (
          <SelectBox name="enableCaptcha" label="是否开启验证码" colSpan={6}>
            <Option value key="yes">是</Option>
            <Option value={false} key="no">否</Option>
          </SelectBox>
        ),
      );
      if (current.get('enableCaptcha')) {
        ret.push(
          (
            <NumberField name="maxCheckCaptcha" label="输错次数" colSpan={6} help="登录时密码错误超过开启验证码的密码错误次数将显示图像验证码" showHelp="tooltip" />
          ),
        );
      }
      ret.push(
        (
          <SelectBox name="enableLock" label="是否开启锁定" colSpan={6}>
            <Option value key="yes">是</Option>
            <Option value={false} key="no">否</Option>
          </SelectBox>
        ),
      );
      if (current.get('enableLock')) {
        ret.push(
          [
            <NumberField name="maxErrorTime" label="输错次数" colSpan={6} help="登录时密码错误超过最大密码错误次数将锁定用户" showHelp="tooltip" />,
            <NumberField name="lockedExpireTime" label="锁定时长" suffix="秒" colSpan={6} help="用户锁定时间超过锁定时长将自动解锁" showHelp="tooltip" />,
          ],
        );
      }

      ret.push(...[
        <SelectBox name="enableWebMultipleLogin" colSpan={6} />,
        <SelectBox name="enableAppMultipleLogin" colSpan={6} />,
        <SelectBox name="loginAgain" colSpan={6} />,
        <div colSpan={6}>
          <div style={{ color: '#4A5C90' }}>
            用户登录二次校验
          </div>
          <Output name="userLoginSecondCheck" label="用户登录二次校验" renderer={() => <Button onClick={handleOpenSecondCheck}>指定用户</Button>} />
        </div>,
      ]);
    }
    return ret;
  }

  const handleOpenSecondCheck = () => {
    const modalDataSet = getSecondCheckModalDataSet(organizationId);

    Modal.open({
      drawer: true,
      title: '指定用户',
      children: <SecondCheckModal dataSet={modalDataSet} organizationId={organizationId} />,
      style: {
        width: 900,
      },
      closable: true,
      footer: false,
    });
  };

  return (
    <div className="safe-modal">
      <Form className="safe-modal-form" dataSet={dataSet} columns={6}>
        <div className="form-title" colSpan={6}>密码安全策略</div>
        <SelectBox name="enablePassword" label="是否启用：" colSpan={6} className="safe-select">
          <Option value key="yes">是</Option>
          <Option value={false} key="no">否</Option>
        </SelectBox>
        { dataSet.current && dataSet.current.get('enablePassword')
          ? (

            [
              <SelectBox
                name="enableRandomPassword"
                label={getHelpLabel('是否开启随机密码', '系统自动生成密码时，是否生成随机密码(如创建子账户时初始密码、重置密码时生成密码)')}
                colSpan={6}
              />,
              <SelectBox name="forceModifyPassword" label="登录时强制修改默认密码" colSpan={6}>
                <Option value key="yes">是</Option>
                <Option value={false} key="no">否</Option>
              </SelectBox>,
              <SelectBox name="notUsername" label="是否允许密码与登录名相同" colSpan={6}>
                <Option value key="yes">是</Option>
                <Option value={false} key="no">否</Option>
              </SelectBox>,
              <SelectBox
                name="forceCodeVerify"
                label={getHelpLabel('强制验证码校验', '在进行密码的相关操作时，需要强制使用验证码功能进行校验')}
                colSpan={6}
              />,
              <TextField name="originalPassword" label="新用户默认密码" colSpan={6} disabled={dataSet.current.get('enableRandomPassword')} />,
              <NumberField step={1} name="minLength" label="最小密码长度" colSpan={3} />,
              <NumberField name="maxLength" className="pwdpolicy-max-length" label="最大密码长度" colSpan={3} />,
              <NumberField name="digitsCount" label="最少数字数" colSpan={2} />,
              <NumberField name="lowercaseCount" label="最少小写字母数" colSpan={2} />,
              <NumberField name="uppercaseCount" label="最少大写字母数" colSpan={2} />,
              <NumberField name="specialCharCount" label="最少特殊字符" colSpan={3} />,
              <NumberField name="notRecentCount" label="最大近期密码" colSpan={3} help="近期密码不能作为更新密码" showHelp="tooltip" />,
              <TextField name="regularExpression" label="密码正则" colSpan={6} />,
              <NumberField name="passwordUpdateRate" label="密码更新频率" suffix="天" colSpan={3} />,
              <NumberField
                className="passwordReminderPeriod"
                name="passwordReminderPeriod"
                label="密码到期提醒"
                suffix={(
                  <span style={{ whiteSpace: 'nowrap' }}>
                    天前
                  </span>
              )}
                colSpan={3}
              />,
            ]
          ) : null}
      </Form>
      <Divider className="divider" colSpan={6} />
      <Form className="safe-modal-form" dataSet={dataSet} columns={6}>
        <div className="form-title" colSpan={6}>登录安全策略</div>
        <SelectBox name="enableSecurity" label="是否启用:" colSpan={6} className="addLine">
          <Option value key="yes">是</Option>
          <Option value={false} key="no">否</Option>
        </SelectBox>
        {getSecurity()}
      </Form>
    </div>
  );
});

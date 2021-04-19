import React, {
  useContext, useState, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Spin, SelectBox, Password, Select, Tooltip, Icon,
} from 'choerodon-ui/pro';
import { useDebounceFn } from 'ahooks';
import Store from './stores';
import UserOptionDataSet from './stores/UserOptionDataSet';
import './index.less';
import TwoFormSelectEditor from '../../../../components/twoFormSelectEditor';

export default observer((props) => {
  const {
    prefixCls, intlPrefix, intl, modal, onOk, dsStore, roleAssignDataSet, projectId, orgRoleDataSet,
  } = useContext(Store);
  useEffect(() => {
    if (roleAssignDataSet.length === 0) { roleAssignDataSet.create({ memberId: [''], roleId: [''] }); }
  });
  function handleCancel() {
    roleAssignDataSet.reset();
  }
  async function handleOk() {
    try {
      await roleAssignDataSet.validate();
      if (await roleAssignDataSet.submit()) {
        await roleAssignDataSet.reset();
        await onOk();
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  modal.handleCancel(handleCancel);
  modal.handleOk(handleOk);

  const {
    run,
    cancel,
  } = useDebounceFn((str, optionDataSet) => {
    optionDataSet.setQueryParameter('user_name', str);
    if (str !== '') { optionDataSet.query(); }
  }, { wait: 500 });
  function handleFilterChange(e, optionDataSet) {
    e.persist();
    run(e.target.value, optionDataSet);
  }

  function handleBlur(optionDataSet, rowIndex) {
    const currentRecord = roleAssignDataSet.current;
    const memberIdArr = currentRecord ? currentRecord.get('memberId') || [] : null;
    const memberId = memberIdArr && memberIdArr[rowIndex];
    if (memberIdArr && !optionDataSet?.some((eachRecord) => eachRecord.get('id') === memberId)) {
      memberIdArr[rowIndex] = '';
      currentRecord.set('memberId', memberIdArr);
    }
  }

  function getOption({ record }) {
    const isLdap = record.get('ldap');
    const email = record.get('email');
    const imgUrl = record.get('imageUrl');
    const realName = record.get('realName');
    const loginName = record.get('loginName');
    return (
      <Tooltip placement="left" title={`${email}`}>
        <div className={`${prefixCls}-option`}>
          <div className={`${prefixCls}-option-avatar`}>
            {
              imgUrl ? <img src={imgUrl} alt="userAvatar" style={{ width: '100%' }} />
                : <span className={`${prefixCls}-option-avatar-noavatar`}>{realName && realName.split('')[0]}</span>
            }
          </div>
          <span>{realName}</span>
          {isLdap && loginName ? (
            <span>
              {`(${loginName})`}
            </span>
          ) : (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {`(${email})`}
            </span>
          )}
        </div>
      </Tooltip>
    );
  }

  return (
    <div
      className={`${prefixCls} ${prefixCls}-modal`}
    >
      <TwoFormSelectEditor
        record={[roleAssignDataSet.current, roleAssignDataSet.current]}
        optionDataSetConfig={[UserOptionDataSet({ id: projectId }), undefined]}
        optionDataSet={[undefined, orgRoleDataSet]}
        name={['memberId', 'roleId']}
        addButton="添加其他用户"
        dsStore={[dsStore]}
      >
        {[(itemProps) => (
          <Select
            {...itemProps}
            labelLayout="float"
            searchable
            searchMatcher={() => true}
            onInput={(e) => handleFilterChange(e, itemProps.options)}
            onBlur={() => handleBlur(itemProps.options, itemProps.rowIndex)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                cancel();
              }
            }}
            style={{ width: '100%' }}
            optionRenderer={getOption}
            addonAfter={(
              <Tooltip title="此处需精确输入用户名或登录名来搜索对应的用户">
                <Icon type="help" className={`${prefixCls}-help-icon`} />
              </Tooltip>
            )}
          />
        ), (itemProps) => (
          <Select
            {...itemProps}
            labelLayout="float"
            style={{ width: '100%' }}
          />
        )]}
      </TwoFormSelectEditor>
    </div>
  );
});

import React, {
  useContext, useState, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { axios } from '@choerodon/master';
import {
  Spin,
  SelectBox,
  Password,
  Select,
  Tooltip,
  Icon,
  TextField,
  Form,
  DatePicker,
  Button,
} from 'choerodon-ui/pro';
import { useDebounceFn } from 'ahooks';
import Store from './stores';
import UserOptionDataSet from './stores/UserOptionDataSet';
import './index.less';
import TwoFormSelectEditor from '../../../../components/twoFormSelectEditor';
import { mapping, wayOptions } from './stores/addWayDataSet';

const { Option } = Select;

export default observer((props) => {
  const {
    prefixCls,
    intlPrefix,
    intl,
    modal,
    onOk,
    dsStore,
    roleAssignDataSet,
    projectId,
    orgRoleDataSet,
    AddWayDataSet,
    outsourcingDataSet,
    AppState: {
      currentMenuType: {
        id,
      },
    },
  } = useContext(Store);
  useEffect(() => {
    if (roleAssignDataSet.length === 0) { roleAssignDataSet.create({ memberId: [''], roleId: [''] }); }
  });

  useEffect(() => {
    roleAssignDataSet.reset();
    outsourcingDataSet.reset();
  }, [AddWayDataSet.current.get(mapping.way.name)]);

  function handleCancel() {
    roleAssignDataSet.reset();
  }
  async function handleOk() {
    if (AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value) {
      try {
        await roleAssignDataSet.validate();
        if (await roleAssignDataSet.submit()) {
          await roleAssignDataSet.reset();
          await onOk();
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    } else {
      const res = await roleAssignDataSet.validate();
      if (res) {
        const { memberId, roleId } = roleAssignDataSet.toData()[0];
        try {
          await axios.post(`/iam/choerodon/v1/projects/${id}/users/assign_roles`,
            memberId.map((i) => ({
              memberId: i,
              roleId,
            })));
          await roleAssignDataSet.reset();
          await onOk();
          return true;
        } catch (e) {
          return false;
        }
      }
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

  const handleUserChange = (value, rowIndex) => {
    console.log(value, rowIndex, 'xxxx');
    const userRecord = outsourcingDataSet.find((record, index, array) => index === rowIndex);
    console.log(userRecord);
    userRecord.set('outsourcing', true);
    userRecord.set('workingGroup', 'xxxxxxxxx');
  };

  const getOption = ({ record }) => {
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
  };

  return (
    <div
      className={`${prefixCls} ${prefixCls}-modal`}
    >
      <Form dataSet={AddWayDataSet}>
        <SelectBox name={mapping.way.name}>
          <Option value={wayOptions[0].value}>{wayOptions[0].text}</Option>
          <Option value={wayOptions[1].value}>{wayOptions[1].text}</Option>
        </SelectBox>
      </Form>
      {
        AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value ? (
          <TwoFormSelectEditor
            record={[roleAssignDataSet.current, roleAssignDataSet.current]}
            optionDataSetConfig={[UserOptionDataSet({ id: projectId }), undefined]}
            optionDataSet={[undefined, orgRoleDataSet]}
            name={['memberId', 'roleId']}
            addButton="添加其他用户"
            dsStore={[dsStore]}
            extraFieldDS={outsourcingDataSet}
          >
            {[(itemProps) => (
              <Select
                {...itemProps}
                labelLayout="float"
                searchable
                searchMatcher={() => true}
                onInput={(e) => handleFilterChange(e, itemProps.options)}
                onBlur={() => handleBlur(itemProps.options, itemProps.rowIndex)}
                onChange={(value) => { handleUserChange(value, itemProps.rowIndex); }}
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
            ),
            (itemProps) => (
              <Form dataSet={outsourcingDataSet} columns={13} colSpan={12} {...itemProps}>
                <DatePicker colSpan={12} newLine name="scheduleEntryTime" />
                <DatePicker colSpan={12} newLine name="scheduleExitTime" />
                <SelectBox colSpan={12} newLine name="outsourcing">
                  <Option value>是</Option>
                  <Option value={false}>否</Option>
                </SelectBox>
                <TextField colSpan={12} newLine name="workingGroup" />
              </Form>
            ),
            ]}
          </TwoFormSelectEditor>
        ) : (
          <>
            <Form
              columns={2}
              dataSet={roleAssignDataSet}
            >
              <Select
                colSpan={1}
                label="选择角色"
                name="roleId"
                options={orgRoleDataSet}
                valueField="id"
                required="true"
                textField="name"
              />
              {/* 只是用于占位 */}
              <TextField
                style={{
                  visibility: 'hidden',
                }}
                colSpan={1}
              />
            </Form>
            <TwoFormSelectEditor
              record={[roleAssignDataSet.current, roleAssignDataSet.current]}
              optionDataSetConfig={[UserOptionDataSet({ id: projectId }), undefined]}
              optionDataSet={[undefined, orgRoleDataSet]}
              name={['memberId', 'roleId']}
              addButton="添加其他用户"
              onlyMember
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
                  onChange={(value) => { handleUserChange(value, itemProps.rowIndex); }}
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
                <TextField
                  {...itemProps}
                  style={{
                    visibility: 'hidden',
                  }}
                />
              ),
              (itemProps) => (
                <Form dataSet={outsourcingDataSet} columns={13} colSpan={12} {...itemProps}>
                  <DatePicker colSpan={12} newLine name="scheduleEntryTime" />
                  <DatePicker colSpan={12} newLine name="scheduleExitTime" />
                  <SelectBox colSpan={12} disabled newLine name="outsourcing">
                    <Option value>是</Option>
                    <Option value={false}>否</Option>
                  </SelectBox>
                  <TextField colSpan={12} disabled newLine name="workingGroup" />
                </Form>
              ),
              ]}
            </TwoFormSelectEditor>
          </>
        )
      }
    </div>
  );
});

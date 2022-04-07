import React, { useContext, useState, useEffect } from 'react';
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
import { Tag } from 'choerodon-ui';
import { useDebounceFn } from 'ahooks';
import { UserInfo } from '@choerodon/components';
import { compact } from 'lodash';
import Store from './stores';
// import UserOptionDataSet from './stores/UserOptionDataSet';
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
    userOptionDataSet,
    normalFormDataSet,
    roleFormDataSet,
    roleChildrenDataSet,
    AppState: {
      currentMenuType: { id },
    },
  } = useContext(Store);

  const [disable, setDisable] = useState(true);

  // useEffect(() => {
  //   if (roleAssignDataSet.length === 0) {
  //     if (AddWayDataSet.current.get(mapping.way.name) === 'normal') {
  //       roleAssignDataSet.create({ memberId: [''], roleIds: [''] });
  //     }
  //     if (AddWayDataSet.current.get(mapping.way.name) === 'role') {
  //       roleAssignDataSet.create({ memberId: [''], roleIds: undefined });
  //     }
  //   }
  // });

  useEffect(() => {
    // roleAssignDataSet.reset();
    // outsourcingDataSet.reset();
    normalFormDataSet.reset();
    roleFormDataSet.reset();
  }, [AddWayDataSet.current.get(mapping.way.name)]);

  function handleCancel() {
    // roleAssignDataSet.reset();
  }
  async function handleOk() {
    let checkRes = false;
    if (AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value) {
      checkRes = await normalFormDataSet.validate();
      if (checkRes) {
        try {
          await axios.post(
            `/iam/choerodon/v1/projects/${id}/users/assign_roles`,
            JSON.stringify(normalFormDataSet.toData()),
          );
          await onOk();
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    }

    if (AddWayDataSet.current.get(mapping.way.name) === wayOptions[1].value) {
      checkRes = await roleFormDataSet.validate();
      if (checkRes) {
        const arr = roleFormDataSet.toData()[0].users;
        arr.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.roleIds = roleFormDataSet.toData()[0].roleIds;
        });
        try {
          await axios.post(
            `/iam/choerodon/v1/projects/${id}/users/assign_roles`,
            JSON.stringify(arr),
          );
          await onOk();
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    }
    return false;
  }

  modal.handleCancel(handleCancel);
  modal.handleOk(handleOk);

  const { run, cancel } = useDebounceFn(
    (str, optionDataSet) => {
      optionDataSet.setQueryParameter('user_name', str);
      if (str !== '') {
        optionDataSet.query();
      }
    },
    { wait: 500 },
  );

  function handleFilterChange(e, optionDataSet) {
    e.persist();
    run(e.target.value, optionDataSet);
  }

  function handleBlur(optionDataSet, rowIndex) {
    const currentRecord = roleAssignDataSet.current;
    const memberIdArr = currentRecord
      ? currentRecord.get('memberId') || []
      : null;
    const memberId = memberIdArr && memberIdArr[rowIndex];
    if (
      memberIdArr
      && !optionDataSet?.some((eachRecord) => eachRecord.get('id') === memberId)
    ) {
      memberIdArr[rowIndex] = '';
      currentRecord.set('memberId', memberIdArr);
    }
  }

  const getOption = ({ record }) => (
    <>
      <UserInfo
        loginName={
          record?.get('ldap') ? record?.get('loginName') : record?.get('email')
        }
        realName={record?.get('realName')}
        avatar={record?.get('imageUrl')}
      />
      {record.get('outsourcing') && (
        <Tag
          style={{
            color: '#4D90FE',
            position: 'relative',
            top: 3,
            marginLeft: 6,
          }}
          color="#E6F7FF"
        >
          外包
        </Tag>
      )}
    </>
  );

  const searchUser = (e) => {
    run(e.target.value, userOptionDataSet);
  };

  const handleCreatOther = () => {
    if (AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value) {
      normalFormDataSet.create();
    }
    if (AddWayDataSet.current.get(mapping.way.name) === wayOptions[1].value) {
      roleFormDataSet?.children?.users.create();
    }
  };

  const handleDeleteItem = (index) => {
    if (AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value) {
      normalFormDataSet.delete(normalFormDataSet.get(index), false);
    }
    if (AddWayDataSet.current.get(mapping.way.name) === wayOptions[1].value) {
      roleFormDataSet?.children?.users.delete(roleFormDataSet?.children?.users.get(index), false);
    }
  };

  return (
    <div className={`${prefixCls} ${prefixCls}-modal`}>
      <Form dataSet={AddWayDataSet}>
        <SelectBox name={mapping.way.name}>
          <Option value={wayOptions[0].value}>{wayOptions[0].text}</Option>
          <Option value={wayOptions[1].value}>{wayOptions[1].text}</Option>
        </SelectBox>
      </Form>
      {AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value ? (
        normalFormDataSet.map((record, index) => (
          <div className={`${prefixCls}-normal-form-cycle-container`}>
            <Form record={record} columns={13}>
              <Select
                name="memberId"
                colSpan={11}
                searchable
                searchMatcher={() => true}
                onInput={searchUser}
                optionRenderer={getOption}
                addonAfter={(
                  <Tooltip title="此处需精确输入用户名或登录名来搜索对应的用户">
                    <Icon type="help" className={`${prefixCls}-help-icon`} />
                  </Tooltip>
                )}
                options={userOptionDataSet}
              />
              <Select
                name="roleIds"
                options={orgRoleDataSet}
                colSpan={11}
                newLine
                multiple
              />
              <DatePicker newLine colSpan={5} name="scheduleEntryTime" />
              <DatePicker colSpan={5} name="scheduleExitTime" />
            </Form>
            {index !== 0 && (
              <Button
                className="delete-btn"
                onClick={() => handleDeleteItem(index)}
                icon="delete_black-o"
                funcType="flat"
              />
            )}
          </div>
        ))
      ) : (
        <Form record={roleFormDataSet.current} columns={13}>
          <Select
            name="roleIds"
            options={orgRoleDataSet}
            colSpan={13}
            newLine
            multiple
          />
          {roleFormDataSet?.children?.users?.map((record, index) => (
            <div
              className={`${prefixCls}-role-form-cycle-container`}
              colSpan={12}
              newLine
            >
              <Form record={record} columns={13} newLine>
                <Select
                  name="memberId"
                  colSpan={12}
                  searchable
                  searchMatcher={() => true}
                  onInput={searchUser}
                  optionRenderer={getOption}
                  addonAfter={(
                    <Tooltip title="此处需精确输入用户名或登录名来搜索对应的用户">
                      <Icon type="help" className={`${prefixCls}-help-icon`} />
                    </Tooltip>
                  )}
                  options={userOptionDataSet}
                  newLine
                />
                <DatePicker newLine colSpan={5} name="scheduleEntryTime" />
                <DatePicker colSpan={5} name="scheduleExitTime" />
              </Form>
              {index !== 0 && (
                <Button
                  className="delete-btn"
                  onClick={() => handleDeleteItem(index)}
                  icon="delete_black-o"
                  funcType="flat"
                />
              )}
            </div>
          ))}
        </Form>
      )}
      <Button onClick={handleCreatOther} icon="add" funcType="flat">
        添加用户
      </Button>
    </div>
  );
});

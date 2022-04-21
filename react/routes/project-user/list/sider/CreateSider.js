import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { axios, UserLabels } from '@choerodon/master';
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
  message,
} from 'choerodon-ui/pro';
import { useDebounceFn } from 'ahooks';
import { UserInfo } from '@choerodon/components';
import { uniqBy } from 'lodash';
import Store from './stores';
import './index.less';
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

  const addWayChange = () => {
    normalFormDataSet.reset();
    roleFormDataSet.reset();
    userOptionDataSet?.loadData([]);
  };

  function handleCancel() {
    // orgUserRoleDataSet.reset();
  }
  async function handleOk() {
    let checkRes = false;
    const currentDs = AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value
      ? normalFormDataSet : roleFormDataSet;
    checkRes = await currentDs.validate();
    if (checkRes) {
      const arr = roleFormDataSet.toData()[0].users;
      arr.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.roleIds = roleFormDataSet.toData()[0].roleIds;
      });
      const postData = currentDs === normalFormDataSet
        ? JSON.stringify(normalFormDataSet.toData()) : JSON.stringify(arr);
      try {
        await axios.post(
          `/iam/choerodon/v1/projects/${id}/users/assign_roles`,
          postData,
        );
        await onOk();
        message.success('添加成功');
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  modal.handleCancel(handleCancel);
  modal.handleOk(handleOk);

  const { run, cancel } = useDebounceFn(
    async (str, optionDataSet) => {
      optionDataSet.setQueryParameter('user_name', str);
      if (str !== '') {
        const currentDs = AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value
          ? normalFormDataSet : roleFormDataSet?.children?.users;
        const arr = [];
        currentDs.forEach((record) => {
          optionDataSet.toData().forEach((item) => {
            if (item.id === record.get('memberId')) {
              arr.push(item);
            }
          });
        });
        await optionDataSet.query();
        optionDataSet.loadData(uniqBy(arr.concat(optionDataSet.toData()), (i) => i.id));
      }
    },
    { wait: 500 },
  );

  const optionRenderer = ({ record }) => (
    <div className={`${prefixCls}-userSelect`}>
      <UserInfo
        loginName={
          record?.get('ldap') ? record?.get('loginName') : record?.get('email')
        }
        realName={record?.get('realName')}
        avatar={record?.get('imageUrl')}
        style={{ marginRight: 6 }}
      />
      <UserLabels list={record?.get('userLabels') || []} />
    </div>
  );

  const onOption = (optionRecord, currentFormRecord) => {
    const currentDs = AddWayDataSet.current.get(mapping.way.name) === wayOptions[0].value
      ? normalFormDataSet : roleFormDataSet?.children?.users;
    let disabled = false;
    currentDs.forEach((formRecord) => {
      if (formRecord !== currentFormRecord) {
        if (optionRecord.get('id') === formRecord.get('memberId')) {
          disabled = true;
        }
      }
    });
    return { disabled };
  };

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
        <SelectBox name={mapping.way.name} onChange={addWayChange}>
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
                optionRenderer={optionRenderer}
                onOption={({ record: optionRecord }) => onOption(optionRecord, record)}
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
              <DatePicker newLine colSpan={5} name="scheduleEntryTime" format="YYYY-MM-DD HH:mm:ss" />
              <DatePicker colSpan={5} name="scheduleExitTime" format="YYYY-MM-DD HH:mm:ss" />
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
                  optionRenderer={optionRenderer}
                  onOption={({ record: optionRecord }) => onOption(optionRecord, record)}
                  addonAfter={(
                    <Tooltip title="此处需精确输入用户名或登录名来搜索对应的用户">
                      <Icon type="help" className={`${prefixCls}-help-icon`} />
                    </Tooltip>
                  )}
                  options={userOptionDataSet}
                  newLine
                />
                <DatePicker newLine colSpan={5} name="scheduleEntryTime" format="YYYY-MM-DD HH:mm:ss" />
                <DatePicker colSpan={5} name="scheduleExitTime" format="YYYY-MM-DD HH:mm:ss" />
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

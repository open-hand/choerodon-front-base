import React, {
  useEffect, useMemo, useCallback, useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { message, Radio } from 'choerodon-ui';
import pick from 'lodash/pick';
import {
  Table, Form, TextField, Select, Icon,
} from 'choerodon-ui/pro';
import { useCreateRoleStore } from './stores';
import LoadingBar from '../../../components/loadingBar';

import './index.less';

const { Column } = Table;
const { Button: RadioButton, Group: RadioGroup } = Radio;

const ListView = () => {
  const {
    AppState: { currentMenuType: { organizationId } },
    menuDs,
    projectMenuDs,
    formDs,
    modal,
    refresh,
    prefixCls,
    level,
    roleStore,
    type,
  } = useCreateRoleStore();

  const [menuLevel, setMenuLevel] = useState('organization');
  const record = useMemo(() => formDs.current, [formDs.current]);
  const isModify = useMemo(() => formDs.current && formDs.current.status !== 'add', [formDs.current]);
  const isDetail = useMemo(() => type === 'detail', [type]);

  const handleOkRole = useCallback(async () => {
    const selectedRecords = menuDs.filter((eachRecord) => eachRecord.get('isChecked'));
    if (!selectedRecords.length) {
      message.error('至少包含一个权限。');
      return false;
    }
    if (await record.validate() === false) {
      return false;
    }
    try {
      const data = record.toData();
      const res = pick(data, ['code', 'name', 'roleLevel']);
      res.roleLabels = level === 'project' ? [data.roleLabels] : [];
      res.menuIdList = [];
      menuDs.forEach((eachRecord) => {
        if (eachRecord.get('isChecked') && eachRecord.get('type') === 'ps') {
          res.menuIdList.push(eachRecord.get('id'));
        }
      });
      let result;
      if (isModify) {
        res.roleLabels = null;
        res.objectVersionNumber = record.get('objectVersionNumber');
        result = await roleStore.editRole(organizationId, res, record.get('id'));
      } else {
        result = await roleStore.createRole(organizationId, res);
      }
      if (result) {
        refresh();
        return true;
      }
      return false;
    } catch (e) {
      // Choerodon.handleResponseError(e);
      return false;
    }
  }, [menuDs.selected, record, level]);

  useEffect(() => {
    if (type !== 'detail') {
      modal.handleOk(handleOkRole);
    }
  }, [handleOkRole, type]);

  function renderName({ record: tableRecord }) {
    const { icon, name } = tableRecord.toData();
    return (
      <>
        <Icon
          type={icon}
          style={{ marginRight: '.08rem', lineHeight: '.32rem', verticalAlign: 'top' }}
        />
        {name}
      </>
    );
  }

  function renderType({ value, record: tableRecord }) {
    const permissionType = {
      api: 'API',
      button: '按钮',
    };
    return tableRecord.get('type') === 'ps' ? permissionType[value] || '' : '';
  }

  if (!record) {
    return <LoadingBar />;
  }

  return (
    <div className={`${prefixCls}`}>
      <Form
        style={{ width: '5.12rem' }}
        record={record}
        columns={2}
        className="c7n-role-msg-form"
      >
        <TextField name="code" disabled={isDetail || isModify} />
        <TextField name="name" disabled={isDetail} />
        {level === 'project' && <Select name="roleLabels" disabled={isDetail || isModify} />}
      </Form>
      <div className={`${prefixCls}-table-wrap-${level}`}>
        <div className={`${prefixCls}-menu`}>
          <span className={`${prefixCls}-menu-text`}>菜单分配</span>
        </div>
        {projectMenuDs.length ? (
          <div className={`${prefixCls}-menu-level`}>
            <RadioGroup
              defaultValue="organization"
              name="level"
              value={menuLevel}
              onChange={(e) => setMenuLevel(e.target.value)}
            >
              <RadioButton value="organization">组织层</RadioButton>
              <RadioButton value="project">项目层</RadioButton>
            </RadioGroup>
          </div>
        ) : null}
        <Table
          dataSet={menuLevel === 'organization' ? menuDs : projectMenuDs}
          queryBar="none"
          mode="tree"
          buttons={[
            ['collapseAll', { icon: 'expand_less', children: '全部收起' }],
            ['expandAll', { icon: 'expand_more', children: '全部展开' }],
          ]}
          expandIconColumnIndex={1}
          className={`${prefixCls}-table`}
          autoHeight={{ type: 'maxHeight', diff: 50 }}
          pristine={isDetail}
        >
          <Column
            name="isChecked"
            editor
            width={50}
            className={isDetail ? `${prefixCls}-table-checked` : ''}
          />
          <Column name="name" renderer={renderName} width={400} />
          <Column name="permissionType" renderer={renderType} />
        </Table>
      </div>
    </div>
  );
};

export default observer(ListView);

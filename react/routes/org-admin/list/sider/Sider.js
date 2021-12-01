import React, { useContext } from 'react';
import { useDebounceFn } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { Select, Tooltip } from 'choerodon-ui/pro';
import Store from './stores';
import './index.less';
import FormSelectEditor from '../../../../components/formSelectEditor';

export default observer(() => {
  const {
    prefixCls, orgAdminCreateDataSet, OrgUserDataSetConfig,
    orgAdminListDataSet, modal, dsStore, formatClient,
  } = useContext(Store);
  modal.handleOk(async () => {
    try {
      const res = await orgAdminCreateDataSet.submit();
      if (!res || res.failed) {
        throw new Error();
      }
      orgAdminListDataSet.query();
      return true;
    } catch (e) {
      return false;
    }
  });

  const getUserOption = ({ record }) => {
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
            <span>
              {`(${email})`}
            </span>
          )}
        </div>
      </Tooltip>
    );
  };

  const {
    run,
    cancel,
  } = useDebounceFn((str, optionDataSet) => {
    optionDataSet.setQueryParameter('user_name', str);
    if (str !== '') {
      optionDataSet.query();
    }
  }, { wait: 500 });

  function handleFilterChange(e, optionDataSet) {
    e.persist();
    run(e.target.value, optionDataSet);
  }

  function handleBlur(optionDataSet, rowIndex) {
    const currentRecord = orgAdminCreateDataSet.current;
    const memberIdArr = currentRecord ? currentRecord.get('userName') || [] : null;
    const memberId = memberIdArr && memberIdArr[rowIndex];
    if (memberIdArr && !optionDataSet?.some((eachRecord) => eachRecord.get('id') === memberId)) {
      memberIdArr[rowIndex] = '';
      currentRecord.set('userName', memberIdArr);
    }
  }

  return (
    <div className={prefixCls}>
      <FormSelectEditor
        record={orgAdminCreateDataSet.current}
        optionDataSetConfig={OrgUserDataSetConfig}
        name="userName"
        addButton={formatClient({ id: 'addOther' })}
        alwaysRequired
        canDeleteAll={false}
        dsStore={dsStore}
      >
        {((itemProps) => (
          <Select
            {...itemProps}
            labelLayout="float"
            style={{ width: '100%' }}
            searchable
            searchMatcher={() => true}
            onInput={(e) => handleFilterChange(e, itemProps.options)}
            onBlur={() => handleBlur(itemProps.options, itemProps.rowIndex)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                cancel();
              }
            }}
            optionRenderer={getUserOption}
          />
        ))}
      </FormSelectEditor>
    </div>
  );
});

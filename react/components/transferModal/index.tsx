import React, {
  useMemo, useCallback, useEffect, useState,
} from 'react';
import {
  Form, Select, DataSet, message,
} from 'choerodon-ui/pro';
import { NewTips, UserInfo } from '@choerodon/components';
import { LabelLayoutType } from 'choerodon-ui/pro/lib/form/Form';
import debounce from 'lodash/debounce';
import { organizationsApi, registerSaasApi } from '@choerodon/master';
import { get } from '@choerodon/inject';
import transferDataSet from './transferDataSet';

import './index.less';

const TransferModal = (props: any) => {
  const {
    modal, tenantId, refresh, site,
  } = props;

  const [isSaas, setIsSaas] = useState(false);

  useEffect(() => {
    registerSaasApi.isSaasTenant({
      tenant_id: tenantId,
    }).then((res:any) => {
      setIsSaas(res);
    });
  }, []);

  const ds: any = useMemo(() => new DataSet(transferDataSet({})), []);

  modal.handleOk(async () => {
    const checkRes = await ds?.current?.getField('user')?.checkValidity();
    if (checkRes) {
      try {
        if (site) {
          await organizationsApi.transferOrgSite({ user_id: ds?.current.get('user')?.id, tenant_id: tenantId });
        } else {
          await organizationsApi.transferOrg(tenantId, { user_id: ds?.current.get('user')?.id });
        }
        message.success('操作成功!');
        if (refresh) {
          refresh();
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return false;
  });

  const notify = async () => {
    const checkRes = await ds?.current?.getField('user')?.checkValidity();
    if (checkRes) {
      try {
        await organizationsApi.transferOrgNotify(tenantId, { user_id: ds?.current.get('user')?.id });
        message.success('通知成功!');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const optionRender = ({ record: itemRecord }: any) => {
    const isLdap = itemRecord.get('ldap');
    const email = itemRecord.get('email');
    const imgUrl = itemRecord.get('imageUrl');
    const realName = itemRecord.get('realName');
    const loginName = itemRecord.get('loginName');
    return (
      <UserInfo
        avatar={imgUrl}
        realName={`${realName}`}
        loginName={isLdap ? loginName : email}
        showTooltip
      />
    );
  };

  const goQuery = useCallback(
    debounce((value) => {
            ds?.getField('user')?.options?.setQueryParameter('param', value);
            ds?.getField('user')?.options?.query();
    }, 500),
    [],
  );

  const handleSearch = useCallback((e) => {
    e.persist();
    goQuery(e.target.value);
  }, []);

  return (
    <>
      <p>您需要在下方选择需要移交的用户,移交用户请先与开放平台进行绑定!</p>
      <Form labelLayout={'horizontal' as LabelLayoutType} dataSet={ds}>
        <Select
          optionRenderer={optionRender}
          pagingOptionContent={<span className="c7ncd-select-load-more-text">加载更多</span>}
          searchable
          searchMatcher={() => true}
          clearButton={false}
          onInput={handleSearch}
          name="user"
        />
      </Form>
      {
                get('base-pro:newUserGuidePage')
                && isSaas && (
                <div className="c7n-iam-organization-transferModal-notify">
                  <span onClick={notify} role="none" className="c7n-iam-organization-transferModal-notify-text">通知</span>
                  <NewTips helpText="SaaS组织移交组织所有者需要先与开放平台进行绑定，若没有绑定请点击「通知」转告移交人，绑定完成才能正常登录开放平台进行采购，若已绑定组织所有者移交后可直接登录开放平台进行采购！" />
                </div>
                )
            }

    </>
  );
};

export default TransferModal;

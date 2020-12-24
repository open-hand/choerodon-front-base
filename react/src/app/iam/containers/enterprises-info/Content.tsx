import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button, SelectBox, Form, TextField, Select, EmailField, CheckBox,
} from 'choerodon-ui/pro';
import { FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import { Choerodon } from '@choerodon/boot';
import { ButtonColor, FuncType } from '@/interface';
import { useOpenManagementStore } from './stores';
import Tips from '../../components/new-tips';
import leftImg from './icon/bgImg.svg';
import logoImg from './icon/choerodon_logo.svg';

import './index.less';

const { Option } = SelectBox;

const RecordTable = observer(() => {
  const {
    prefixCls,
    intlPrefix,
    formDs,
    formatMessage,
    scaleList,
    businessTypeList,
  } = useOpenManagementStore();

  const handleSubmit = async () => {
    if (!formDs.current?.get('agreement')) {
      Choerodon.prompt(formatMessage({ id: `${intlPrefix}.agree` }));
      return false;
    }
    try {
      await formDs.submit();
      window.location.href = document.referrer;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className={`${prefixCls}`}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className={`${prefixCls}-left`}>
        <img className={`${prefixCls}-logo`} src={logoImg} alt="logo" />
        <img src={leftImg} alt="" className={`${prefixCls}-overImg`} />
      </div>
      <div className={`${prefixCls}-right`}>
        <div className={`${prefixCls}-right-content`}>
          <span className={`${prefixCls}-form-title`}>
            {formatMessage({ id: `${intlPrefix}.confirm` })}
          </span>
          <p className={`${prefixCls}-form-tip`}>
            {formatMessage({ id: `${intlPrefix}.tips` })}
          </p>
          <Form dataSet={formDs}>
            <TextField name="tenantName" colSpan={2} />
          </Form>
          <Tips
            colSpan={2}
            title={formatMessage({ id: `${intlPrefix}.admin.info` })}
            helpText={formatMessage({ id: `${intlPrefix}.admin.info.tips` })}
            className={`${prefixCls}-form-admin`}
          />
          <Form dataSet={formDs} columns={2}>
            <TextField name="adminName" />
            <TextField name="adminPhone" />
            <EmailField name="adminEmail" />
            <TextField name="enterpriseName" />
            <Select name="enterpriseType">
              {businessTypeList.map((item: string) => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
            <Select name="enterpriseScale">
              {scaleList.map((v: string, index: number) => (
                <Option value={v}>{index !== scaleList.length - 1 ? `${v}-${scaleList[index + 1]}` : '5000人以上'}</Option>
              ))}
            </Select>
            <CheckBox name="agreement" style={{ fontSize: '14px' }}>
              我同意&nbsp;
              <a href="/#/iam/enterprise/agreement" target="_blank" rel="noopener noreferrer">
                隐私条款
              </a>
            </CheckBox>
          </Form>
          <Button
            color={'primary' as ButtonColor}
            funcType={'raised' as FuncType}
            className={`${prefixCls}-btn`}
            onClick={handleSubmit}
          >
            <FormattedMessage id="ok" />
          </Button>
          <div className={`${prefixCls}-bbs`}>
            如有问题请至
            <a href="http://forum.choerodon.io" target="_black">Choerodon论坛</a>
            反馈
          </div>
        </div>
      </div>
    </div>
  );
});

export default RecordTable;

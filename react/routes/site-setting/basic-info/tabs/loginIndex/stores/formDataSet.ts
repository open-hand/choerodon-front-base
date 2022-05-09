import { systemApiConifg } from '@choerodon/master';
import DataSet from 'choerodon-ui/dataset';

export default ({ }: any): object => ({
  autoCreate: true,
  autoQuery: false,
  fields: [
    {
      name: 'loginLogo',
      label: 'loginLogo',
    },
    {
      name: 'loginPage',
      label: 'loginPage',
    },
    {
      name: 'loginTitle',
      label: '登录标题',
      required: true,
    },
    {
      name: 'loginCopyRight',
      label: '版权信息',
    },
    {
      name: 'loginInternetContentProvider',
      label: '域名备案号',
    },
    {
      name: 'loginPhone',
      label: '联系电话',
    },
    {
      name: 'loginEmail',
      label: '联系邮箱',
    },
    {
      name: 'loginSlogan',
      label: '标语',
      maxLength: 95,
    },
    {
      name: 'loginWay',
      label: '登录方式',
      required: true,
      options: new DataSet({
        data: [{ value: 'account', meaning: '账号密码登录' }, { value: 'phone', meaning: '手机验证登录' }],
      }),
    },
    {
      name: 'loginEnableDingTalkScanningLogin',
      label: '是否启用钉钉扫码登录',
    },
    {
      name: 'loginDingTalkAppKey',
      label: 'AppKey',
      dynamicProps: {
        required: ({ dataSet, record }:any) => record.get('loginEnableDingTalkScanningLogin') === 'true',
      },
    },
    {
      name: 'loginDingTalkAppSecret',
      label: 'AppSecret',
      dynamicProps: {
        required: ({ dataSet, record }:any) => record.get('loginEnableDingTalkScanningLogin') === 'true',
      },
    },
  ],
  transport: {
    read: {
      url: systemApiConifg.getLoginIndexInfo().url,
      method: 'get',
      transformResponse: (data:any) => {
        const newData = JSON.parse(data);
        newData.loginWay = newData.loginWay.split(',');
        return newData;
      },
    },
  },
});

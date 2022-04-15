// import { organizationsApiConfig } from '@choerodon/master';

export default ({ }: any): object => ({
  autoCreate: true,
  fields: [
    {
      name: 'a',
      label: '登录标题',
      defaultValue: '登录猪齿鱼',
    },
    {
      name: 'b',
      label: '版权信息',
      defaultValue: 'Copyright Hand China Co.,Ltd. All Rights Reserved 甄知技术股份有限公司沪ICP备14039535号-20',
    },
    {
      name: 'c',
      label: '域名备案号',
      defaultValue: '沪ICP备14039535号-18',
    },
    {
      name: 'd',
      label: '默认语言',
      defaultValue: '简体中文',
    },
    {
      name: 'e',
      label: '联系电话',
      defaultValue: '400-168-4263',
    },
    {
      name: 'f',
      label: '联系邮箱',
      defaultValue: 'zhuchiyu@vip.hand-china.com',
    },
    {
      name: 'g',
      label: '标语',
      defaultValue: '传递体系化方法论，提供协作、测试、DevOps及容器工具，让团队效能提升更快更稳更简单',
    },
    {
      name: 'h',
      label: '登录方式',
      defaultValue: '账户密码登录 手机验证登录',
    },
    {
      name: 'i',
      label: '是否启用钉钉扫码登录',
      defaultValue: '是',
    },
    {
      name: 'j',
      label: 'AppKey',
      defaultValue: 'dingcwix4',
    },
    {
      name: 'k',
      label: 'AppSecret',
      defaultValue: 'QZcV8C9Co',
    },
  ],
  transport: {
    read: {
      //   url: organizationsApiConfig.cooperationProjStatusList().url,
      url: 'http://172.23.16.154:30094/agile/v1/projects/282911590022897664/waterfall/deliverable/page_by_projectId',
      method: 'get',
    },
  },
});

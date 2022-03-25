import { organizationsApiConfig } from '@choerodon/master';

export default ({ historyId }: {historyId: string}): object => ({
  autoCreate: true,
  autoQuery: true,
  selection: false,
  fields: [
    { name: 'loginName', type: 'string', label: '登录名' },
    { name: 'email', type: 'string', label: '邮箱' },
    { name: 'name', type: 'string', label: '名称' },
    { name: 'phone', type: 'string', label: '手机' },
    { name: 'cause', type: 'string', label: '失败原因' },
  ],
  queryFields: [
    { name: 'loginName', type: 'string', label: '登录名' },
    { name: 'email', type: 'string', label: '邮箱' },
    { name: 'name', type: 'string', label: '名称' },
    { name: 'phone', type: 'string', label: '手机' },
    { name: 'cause', type: 'string', label: '失败原因' },
  ],
  transport: {
    read: {
      url: organizationsApiConfig.thirdPartyAppErrorUsers(historyId).url,
      method: 'post',
    },
  },
});

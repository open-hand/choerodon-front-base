import { DataSet } from 'choerodon-ui/pro';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ orgId, name, formatClient }) => {
  const directoryTypeOption = new DataSet({
    data: [{
      value: 'Microsoft Active Directory',
      meaning: 'Microsoft Active Directory',
    }, {
      value: 'OpenLDAP',
      meaning: 'OpenLDAP',
    }],
  });
  return {
    autoCreate: true,
    autoQuery: true,
    transport: {
      read: {
        url: `/iam/v1/${orgId}/ldaps`,
        method: 'get',
        dataKey: null,
      },
      submit: ({ data: [ldap] }) => ({
        url: `/iam/v1/${orgId}/ldaps`,
        method: 'put',
        dataKey: null,
        data: ldap,
      }),
    },
    fields: [
      { name: 'name', type: 'string', defaultValue: name },
      { name: 'organizationId', type: 'string', defaultValue: orgId },
      {
        name: 'directoryType', type: 'string', label: formatClient({ id: 'ldap.directoryType' }), required: true, options: directoryTypeOption,
      },
      {
        name: 'serverAddress', type: 'string', label: formatClient({ id: 'ldap.hostName' }), required: true,
      }, // 必填
      {
        name: 'useSSL', type: 'boolean', label: formatClient({ id: 'ldap.whetherToUseSSL' }), defaultValue: false,
      },
      {
        name: 'port', type: 'number', label: formatClient({ id: 'ldap.portNumber' }), required: true,
      }, // 必填
      { name: 'enabled', type: 'boolean' },
      {
        name: 'sagaBatchSize', type: 'number', label: formatClient({ id: 'ldap.numberOfSagasentUsers' }), min: 1, step: 1, defaultValue: 500, required: true,
      }, // 必填
      {
        name: 'connectionTimeout', type: 'number', label: formatClient({ id: 'ldap.ldapServerConnectionTimeoutPeriod' }), min: 0, defaultValue: 10, required: true,
      },
      {
        name: 'baseDn', type: 'string', label: formatClient({ id: 'ldap.benchmarkDN' }), help: 'LDAP目录树的最顶部的根，从根节点搜索用户。例如：cn=users,dc=example,dc=com',
      },
      {
        name: 'account', type: 'string', label: formatClient({ id: 'ldap.administratorLoginName' }), help: '用户登录到 LDAP。例如：user@domain.name 或 cn =用户, dc =域、dc =名称', required: true,
      }, // 必填
      {
        name: 'ldapPassword', type: 'string', label: formatClient({ id: 'ldap.administratorPassword' }), required: true,
      }, // 必填
      {
        name: 'objectClass', type: 'string', label: formatClient({ id: 'ldap.userObjectClass' }), help: '仅支持单个objectclass', required: true,
      }, // 多个objectClass以逗号分割/非必填
      {
        name: 'loginNameField', type: 'string', label: formatClient({ id: 'ldap.loginNameAttribute' }), required: true,
      },
      {
        name: 'emailField', type: 'string', label: formatClient({ id: 'ldap.emailAttribute' }), required: true,
      },
      { name: 'realNameField', type: 'string', label: formatClient({ id: 'ldap.userNameAttributes' }) },
      { name: 'phoneField', type: 'string', label: formatClient({ id: 'ldap.phoneNumberAttributes' }) },
      {
        name: 'uuidField', type: 'string', label: formatClient({ id: 'ldap.uuidProperty' }), help: 'ldap对象的唯一标识，大多数是\'entryUUID\'属性，Microsoft Active Directory可能是\'objectGUID\'属性，如果您的的ldap服务器确实不支持uuid，使用能唯一标识对象的字段即可，比如\'uid\'或者\'entryDN\'。', required: true,
      },
      {
        name: 'customFilter', type: 'string', label: formatClient({ id: 'ldap.userDefinedUserFilteringCriteria' }), help: '额外的过滤条件用于同步用户，允许为空，表达式必须以\'(\'开始，以\')\'结束，语法参考ldap search syntax。',
      },
    ],
  };
};

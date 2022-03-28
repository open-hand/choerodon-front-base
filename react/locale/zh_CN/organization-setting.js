// ~~组织基础设置
const base = {
  'c7ncd.organization-setting.base.organizeInformation': '组织信息',
  'c7ncd.organization-setting.base.Edit': '修改',
  'c7ncd.organization-setting.base.organizationName': '组织名称',
  'c7ncd.organization-setting.base.organizationCode': '组织编码',
  'c7ncd.organization-setting.base.locationOfOrganization': '组织所在地',
  'c7ncd.organization-setting.base.website': '官网地址',
  'c7ncd.organization-setting.base.organizationOwner': '所有者',
  'c7ncd.organization-setting.base.logo': '组织LOGO',
  'c7ncd.organization-setting.base.transfer': '移交组织所有者',
};

const ldap = {
  'c7ncd.organization-setting.ldap.ldapSet': 'LDAP设置',
  'c7ncd.organization-setting.ldap.synchronousRecord': '同步记录',
  'c7ncd.organization-setting.ldap.simultaneousUsers': '同步用户',
  'c7ncd.organization-setting.ldap.testConnection': '测试连接',
  'c7ncd.organization-setting.ldap.disable': '停用',
  'c7ncd.organization-setting.ldap.edit': '修改',
  'c7ncd.organization-setting.ldap.enable': '启用',

  'c7ncd.organization-setting.ldap.serverSettings': '服务器设置',
  'c7ncd.organization-setting.ldap.directoryType': '目录类型',
  'c7ncd.organization-setting.ldap.hostName': '主机名',
  'c7ncd.organization-setting.ldap.whetherToUseSSL': '是否使用SSL',
  'c7ncd.organization-setting.ldap.portNumber': '端口号',
  'c7ncd.organization-setting.ldap.numberOfSagasentUsers': '同步用户saga发送用户数量',
  'c7ncd.organization-setting.ldap.ldapServerConnectionTimeoutPeriod': 'ldap服务器连接超时时间',
  'c7ncd.organization-setting.ldap.benchmarkDN': '基准DN',
  'c7ncd.organization-setting.ldap.administratorLoginName': '管理员登录名',
  'c7ncd.organization-setting.ldap.administratorPassword': '管理员密码',

  'c7ncd.organization-setting.ldap.userSettings': '用户属性设置',
  'c7ncd.organization-setting.ldap.userObjectClass': '用户对象类',
  'c7ncd.organization-setting.ldap.loginNameAttribute': '登录名属性',
  'c7ncd.organization-setting.ldap.emailAttribute': '邮箱属性',
  'c7ncd.organization-setting.ldap.userNameAttributes': '用户名属性',
  'c7ncd.organization-setting.ldap.phoneNumberAttributes': '手机号属性',
  'c7ncd.organization-setting.ldap.uuidProperty': 'uuid属性',
  'c7ncd.organization-setting.ldap.userDefinedUserFilteringCriteria': '自定义筛选用户条件',
};

const workingCalendar = {
  'c7ncd.organization-setting.workingCalendar.workingCalendar': '工作日历',
  'c7ncd.organization-setting.workingCalendar.timezone': '时区',
  'c7ncd.organization-setting.workingCalendar.calendar': '日历',
  'c7ncd.organization-setting.workingCalendar.edit': '修改',
};

const thirdPartyAppManagement = {
  'c7ncd.organization-setting.thirdPartyAppManagement.thirdPartyAppManagement': '第三方应用管理',
  // 'c7ncd.organization-setting.thirdPartyAppManagement.timezone': 'Time Zone',
  // 'c7ncd.organization-setting.thirdPartyAppManagement.calendar': 'Calendar',
  // 'c7ncd.organization-setting.thirdPartyAppManagement.edit': 'Edit',
};

export {
  base, ldap, workingCalendar, thirdPartyAppManagement,
};

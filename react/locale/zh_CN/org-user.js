const docServer = 'http://v0-14.choerodon.io/zh/docs';

const orguser = {

  // 用户管理
  'c7ncd.org-user.title': '组织"{name}"的用户管理',
  'c7ncd.org-user.addteammate': '添加团队成员',
  'c7ncd.org-user.modifyteammate': '修改团队成员',
  'c7ncd.org-user.inviteteammate': '邀请成员',
  'c7ncd.org-user.invitEmail': '邮件邀请成员',
  'c7ncd.org-user.invitLink': '链接邀请成员',
  'c7ncd.org-user.sendInvitation': '发送邀请',
  'c7ncd.org-user.importteammate': '导入团队成员',
  'c7ncd.org-user.cardmode': '卡片模式',
  'c7ncd.org-user.listmode': '列表模式',

  'c7ncd.org-user.description': '用户是平台的使用者。您可以在组织下创建用户，则用户属于这个组织。',
  'c7ncd.org-user.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.org-user.create.title': '在组织"{name}"中创建用户',
  'c7ncd.org-user.create.description': '用户是全平台唯一的。您创建的用户只属于这个组织，但在平台的其他组织中能被分配角色。',
  'c7ncd.org-user.create.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.org-user.modify.title': '对用户"{name}"进行修改',
  'c7ncd.org-user.modify.description': '您可以在此修改用户名、邮箱、语言、时区。',
  'c7ncd.org-user.modify.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.org-user.upload.title': '在组织"{name}"中导入用户',
  'c7ncd.org-user.upload.description': '您可以在此将文件中的信息导入到组织中去。注：您必须使用用户上传模板，请在用户管理界面，点击“下载模板”下载模板。',
  'c7ncd.org-user.upload.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.org-user.add.user.tip': '添加系统其他组织用户作为当前组织用户',
  'c7ncd.org-user.import.user.tip': '批量添加系统其他组织用户作为当前组织用户',
  // 用户
  'c7ncd.org-user.status': '状态',
  'c7ncd.org-user.safe-status': '安全状态',
  'c7ncd.org-user.button.create-user': '创建用户',
  'c7ncd.org-user.button.import-user': '导入用户',
  'c7ncd.org-user.button.addUser': '添加用户',
  'c7ncd.org-user.button.assign-roles': '添加组织用户',
  'c7ncd.org-user.button.importingOrganizationUsers': '导入组织用户',
  'c7ncd.org-user.button.LDAPSynchronizationSettings': 'LDAP同步设置',
  'c7ncd.org-user.button.create.disabled': '组织用户数量已达上限，无法创建更多用户',
  'c7ncd.org-user.button.invite.disabled': '组织用户数量已达上限，无法邀请更多用户',
  // 用户管理
  'c7ncd.org-user.unlock': '解锁',
  'c7ncd.org-user.importingNewUser': '导入新用户',
  'c7ncd.org-user.unlock.success': '解锁成功',
  'c7ncd.org-user.unlock.failed': '解锁失败',
  'c7ncd.org-user.reset': '重置密码',
  'c7ncd.org-user.reset.success': '重置密码成功',
  'c7ncd.org-user.reset.failed': '重置密码失败',
  'c7ncd.org-user.reset.title': '确认重置当前用户密码',
  'c7ncd.org-user.reset.content': '{loginName}用户的当前密码将失效。如果您启用组织密码策略，将重置为组织默认密码，否则将重置为平台密码。',
  'c7ncd.org-user.language': '语言',
  'c7ncd.org-user.create': '创建用户',
  'c7ncd.org-user.createNew': '创建新用户',
  'c7ncd.org-user.modify': '修改用户',
  'c7ncd.org-user.loginname': '登录名',
  'c7ncd.org-user.realname': '用户名',
  'c7ncd.org-user.source': '认证来源',
  'c7ncd.org-user.ldap': 'LDAP用户',
  'c7ncd.org-user.notldap': '非LDAP用户',
  'c7ncd.org-user.enabled': '启用状态',
  'c7ncd.org-user.locked': '安全状态',
  'c7ncd.org-user.lock': '锁定',
  'c7ncd.org-user.normal': '正常',
  'c7ncd.org-user.header.title': '用户管理',
  'c7ncd.org-user.name.space.msg': '输入存在空格，请检查',
  'c7ncd.org-user.name.samepwd.msg': '登录名不能与密码相同',
  'c7ncd.org-user.name.exist.msg': '已存在该登录名，请输入其他登录名',
  'c7ncd.org-user.password.unrepeat.msg': '两次密码输入不一致',
  'c7ncd.org-user.email.used.msg': '该邮箱已被使用，请输入其他邮箱',
  'c7ncd.org-user.addinfo.pattern.msg': '请输入json格式的数据',
  'c7ncd.org-user.loginname.require.msg': '请输入登录名',
  'c7ncd.org-user.loginname.pattern.msg': '登录名只能由字母、数字、"-"、"_"、"."组成，且不能以"-"开头，不能以"."、 ".git"或者".atom"结尾',
  'c7ncd.org-user.realname.require.msg': '请输入用户名',
  'c7ncd.org-user.email.require.msg': '请输入邮箱',
  'c7ncd.org-user.email.pattern.msg': '请输入正确的邮箱',
  'c7ncd.org-user.email': '邮箱',
  'c7ncd.org-user.password.require.msg': '请输入密码',
  'c7ncd.org-user.password': '密码',
  'c7ncd.org-user.repassword': '确认密码',
  'c7ncd.org-user.repassword.require.msg': '请确认密码',
  'c7ncd.org-user.timezone': '时区',
  'c7ncd.org-user.download.template': '下载模板',
  'c7ncd.org-user.upload.file': '上传',
  'c7ncd.org-user.upload': '导入用户',
  'c7ncd.org-user.upload.lasttime': '上次导入完成时间',
  'c7ncd.org-user.upload.norecord': '当前没有导入用户记录',
  'c7ncd.org-user.upload.time': '共导入{successCount}条数据成功，{failedCount}条数据失败',
  'c7ncd.org-user.upload.spendtime': '耗时',
  'c7ncd.org-user.uploading.text': '正在导入...',
  'c7ncd.org-user.fileloading.text': '正在上传...',
  'c7ncd.org-user.fileloading': '上传中',
  'c7ncd.org-user.uploading.tip': '（本次导入耗时较长，您可先返回进行其他操作）',
  'c7ncd.org-user.download.failed.detail': '点击下载失败详情',
  'c7ncd.org-user.download.failed.error': '失败详情文件丢失，无法下载',
  'c7ncd.org-user.action.enable': '启用',
  'c7ncd.org-user.action.disable': '停用',
  'c7ncd.org-user.action.unlock': '解锁',
  'c7ncd.org-user.action.lock': '锁定',
  'c7ncd.org-user.action.reset': '重置密码',
  'c7ncd.org-user.action.modify': '修改',
  'c7ncd.org-user.sider.create.title': '创建用户',
  'c7ncd.org-user.sider.modify.title': '修改用户',
  'c7ncd.org-user.sider.role-assignment.title': '角色分配',
  'c7ncd.org-user.sider.import.title': '导入用户',
};

export {
  orguser,
};

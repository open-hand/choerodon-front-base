const docServer = 'http://v0-14.choerodon.io/zh/docs';

const orguser = {

  // 用户管理
  'c7ncd.orguser.title': '组织"{name}"的用户管理',
  'c7ncd.orguser.addteammate': '添加团队成员',
  'c7ncd.orguser.modifyteammate': '修改团队成员',
  'c7ncd.orguser.inviteteammate': '邀请成员',
  'c7ncd.orguser.sendInvitation': '发送邀请',
  'c7ncd.orguser.importteammate': '导入团队成员',
  'c7ncd.orguser.cardmode': '卡片模式',
  'c7ncd.orguser.listmode': '列表模式',

  'c7ncd.orguser.description': '用户是平台的使用者。您可以在组织下创建用户，则用户属于这个组织。',
  'c7ncd.orguser.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.orguser.create.title': '在组织"{name}"中创建用户',
  'c7ncd.orguser.create.description': '用户是全平台唯一的。您创建的用户只属于这个组织，但在平台的其他组织中能被分配角色。',
  'c7ncd.orguser.create.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.orguser.modify.title': '对用户"{name}"进行修改',
  'c7ncd.orguser.modify.description': '您可以在此修改用户名、邮箱、语言、时区。',
  'c7ncd.orguser.modify.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.orguser.upload.title': '在组织"{name}"中导入用户',
  'c7ncd.orguser.upload.description': '您可以在此将文件中的信息导入到组织中去。注：您必须使用用户上传模板，请在用户管理界面，点击“下载模板”下载模板。',
  'c7ncd.orguser.upload.link': `${docServer}/user-guide/system-configuration/tenant/user/`,

  'c7ncd.orguser.add.user.tip': '添加系统其他组织用户作为当前组织用户',
  'c7ncd.orguser.import.user.tip': '批量添加系统其他组织用户作为当前组织用户',
  // 用户
  'c7ncd.orguser.status': '状态',
  'c7ncd.orguser.safe-status': '安全状态',
  'c7ncd.orguser.button.create-user': '创建用户',
  'c7ncd.orguser.button.import-user': '导入用户',
  'c7ncd.orguser.button.assign-roles': '添加组织用户',
  'c7ncd.orguser.button.create.disabled': '组织用户数量已达上限，无法创建更多用户',
  'c7ncd.orguser.button.invite.disabled': '组织用户数量已达上限，无法邀请更多用户',
  // 用户管理
  'c7ncd.orguser.unlock': '解锁',
  'c7ncd.orguser.unlock.success': '解锁成功',
  'c7ncd.orguser.unlock.failed': '解锁失败',
  'c7ncd.orguser.reset': '重置密码',
  'c7ncd.orguser.reset.success': '重置密码成功',
  'c7ncd.orguser.reset.failed': '重置密码失败',
  'c7ncd.orguser.reset.title': '确认重置当前用户密码',
  'c7ncd.orguser.reset.content': '{loginName}用户的当前密码将失效。如果您启用组织密码策略，将重置为组织默认密码，否则将重置为平台密码。',
  'c7ncd.orguser.language': '语言',
  'c7ncd.orguser.create': '创建用户',
  'c7ncd.orguser.modify': '修改用户',
  'c7ncd.orguser.loginname': '登录名',
  'c7ncd.orguser.realname': '用户名',
  'c7ncd.orguser.source': '认证来源',
  'c7ncd.orguser.ldap': 'LDAP用户',
  'c7ncd.orguser.notldap': '非LDAP用户',
  'c7ncd.orguser.enabled': '启用状态',
  'c7ncd.orguser.locked': '安全状态',
  'c7ncd.orguser.lock': '锁定',
  'c7ncd.orguser.normal': '正常',
  'c7ncd.orguser.header.title': '用户管理',
  'c7ncd.orguser.name.space.msg': '输入存在空格，请检查',
  'c7ncd.orguser.name.samepwd.msg': '登录名不能与密码相同',
  'c7ncd.orguser.name.exist.msg': '已存在该登录名，请输入其他登录名',
  'c7ncd.orguser.password.unrepeat.msg': '两次密码输入不一致',
  'c7ncd.orguser.email.used.msg': '该邮箱已被使用，请输入其他邮箱',
  'c7ncd.orguser.addinfo.pattern.msg': '请输入json格式的数据',
  'c7ncd.orguser.loginname.require.msg': '请输入登录名',
  'c7ncd.orguser.loginname.pattern.msg': '登录名只能由字母、数字、"-"、"_"、"."组成，且不能以"-"开头，不能以"."、 ".git"或者".atom"结尾',
  'c7ncd.orguser.realname.require.msg': '请输入用户名',
  'c7ncd.orguser.email.require.msg': '请输入邮箱',
  'c7ncd.orguser.email.pattern.msg': '请输入正确的邮箱',
  'c7ncd.orguser.email': '邮箱',
  'c7ncd.orguser.password.require.msg': '请输入密码',
  'c7ncd.orguser.password': '密码',
  'c7ncd.orguser.repassword': '确认密码',
  'c7ncd.orguser.repassword.require.msg': '请确认密码',
  'c7ncd.orguser.timezone': '时区',
  'c7ncd.orguser.download.template': '下载模板',
  'c7ncd.orguser.upload.file': '上传',
  'c7ncd.orguser.upload': '导入用户',
  'c7ncd.orguser.upload.lasttime': '上次导入完成时间',
  'c7ncd.orguser.upload.norecord': '当前没有导入用户记录',
  'c7ncd.orguser.upload.time': '共导入{successCount}条数据成功，{failedCount}条数据失败',
  'c7ncd.orguser.upload.spendtime': '耗时',
  'c7ncd.orguser.uploading.text': '正在导入...',
  'c7ncd.orguser.fileloading.text': '正在上传...',
  'c7ncd.orguser.fileloading': '上传中',
  'c7ncd.orguser.uploading.tip': '（本次导入耗时较长，您可先返回进行其他操作）',
  'c7ncd.orguser.download.failed.detail': '点击下载失败详情',
  'c7ncd.orguser.download.failed.error': '失败详情文件丢失，无法下载',
  'c7ncd.orguser.action.enable': '启用',
  'c7ncd.orguser.action.disable': '停用',
  'c7ncd.orguser.action.unlock': '解锁',
  'c7ncd.orguser.action.lock': '锁定',
  'c7ncd.orguser.action.reset': '重置密码',
  'c7ncd.orguser.action.modify': '修改',
  'c7ncd.orguser.sider.create.title': '创建用户',
  'c7ncd.orguser.sider.modify.title': '修改用户',
  'c7ncd.orguser.sider.role-assignment.title': '角色分配',
  'c7ncd.orguser.sider.import.title': '导入用户',
};

export {
  orguser,
};

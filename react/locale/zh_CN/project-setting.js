const docServer = 'http://v0-14.choerodon.io/zh/docs';

export const projectSettingsInfo = {
  'c7ncd.project.setting.info.disable.title': '停用项目',
  'c7ncd.project.setting.info.disable.program.title': '停用项目群',
  'c7ncd.project.setting.info.disable.content': '确定要停用项目"{name}"吗？停用后，您和项目下其他成员将无法进入此项目。',
  'c7ncd.project.setting.info.disable.program.tips': ' 项目群停用后，ART将自动停止，子项目和项目群的关联也将自动停用，子项目的迭代节奏、迭代规划不再受到ART的统一管理。ART下进行中的PI将直接完成，未完成的PI将会删除，未完成的特性将会移动至待办。子项目进行中的迭代会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！',
  'c7ncd.project.setting.info.disable.subProject.tips': ' 子项目停用后，与项目群相关的冲刺将发生变动，进行中的冲刺会直接完成，未开始的冲刺将会删除，未完成的问题将会移动至待办。请谨慎操作！',
  'c7ncd.project.setting.info.header.title': '项目信息',
  'c7ncd.project.setting.info.setting': '项目设置',
  'c7ncd.project.setting.info.otherSetting': '其他设置',
  'c7ncd.project.setting.info.name': '项目名称',
  'c7ncd.project.setting.info.applicationName': '应用名称',
  'c7ncd.project.setting.info.agile.prefix': '敏捷问题前缀',
  'c7ncd.project.setting.info.test.prefix': '测试问题前缀',
  'c7ncd.project.setting.info.waterfall.startTime': '立项时间',
  'c7ncd.project.setting.info.waterfall.endTime': '结项时间',

  'c7ncd.project.setting.info.code': '项目编码',
  'c7ncd.project.setting.info.category': '项目类型',
  'c7ncd.project.setting.info.app': '应用名称',
  'c7ncd.project.setting.info.creationDate': '创建时间',
  'c7ncd.project.setting.info.creator': '创建人',
  'c7ncd.project.setting.info.namerequiredmsg': '请输入项目名称',
  'c7ncd.project.setting.info.appnamerequiredmsg': '请输入应用名称',
  'c7ncd.project.setting.info.agilePrefixrequiredmsg': '请输入问题前缀',
  'c7ncd.project.setting.info.agilePrefix.maxMsg': '问题前缀长度超过5',

  'c7ncd.project.setting.info.waterfall.startTime.requiredMsg': '请输入立项时间',
  'c7ncd.project.setting.info.waterfall.endTime.requiedMsg': '请输入结项时间',

  'c7ncd.project.setting.info.name.pattern.msg': '项目名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成',
  'c7ncd.project.setting.info.app.name.pattern.msg': '应用名称只能由汉字、字母、数字、"_"、"."、"-"、"——"和空格组成',
  'c7ncd.project.setting.info.type': '项目类型',
  'c7ncd.project.setting.info.type.empty': '无项目类型',
  'c7ncd.project.setting.info.empty': '无',
  'c7ncd.project.setting.info.avatar': '项目Logo',
  'c7ncd.project.setting.info.description.title': '项目描述',

  // 修改项目进度提示框
  'c7ncd.project.setting.info.failed.update': '更新失败',
  'c7ncd.project.setting.info.updating': '更新中',
  'c7ncd.project.setting.info.saga.title.updating.update': '修改项目',
  'c7ncd.project.setting.info.saga.title.success.update': '更新项目成功',
  'c7ncd.project.setting.info.saga.title.failed.update': '更新项目失败',
  'c7ncd.project.setting.info.saga.des.updating.update': '正在更新项目，该过程可能会持续几分钟。待修改成功，刷新页面后即可见到项目的新菜单。',
  'c7ncd.project.setting.info.saga.des.success.update': '项目更新成功，进入项目后刷新即可。',

  // 项目信息
  'c7ncd.project.setting.info.title': '对项目"{name}"进行项目设置',
  'c7ncd.project.setting.info.description': '您可以在此修改项目名称、停用项目。',
  'c7ncd.project.setting.info.link': `${docServer}/user-guide/system-configuration/project/pro_info/`,
  'c7ncd.project.setting.info.disabled.title': '项目"{name}"已被停用',
  'c7ncd.project.setting.info.disabled.description': '您可以在此修改项目名称、停用项目。',
  'c7ncd.project.setting.info.disabled.link': `${docServer}/user-guide/system-configuration/project/pro_info/`,
};

export {
  // projectSettings,
};

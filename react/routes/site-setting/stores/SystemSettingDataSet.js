const mapping = {
  openAppMarket: {
    name: 'enableOpenPlatformMarket',
    type: 'boolean',
    defaultValue: true,
    label: '是否启用开放平台市场应用',
  },
};

export { mapping };

export default ({
  id = 0, hasRegister, intlPrefix, formatCommon, format,
}) => {
  const fields = hasRegister ? [
    { name: 'registerEnabled', type: 'boolean', label: '是否启用注册' },
    {
      name: 'registerUrl',
      type: 'url',
      label: '注册页面链接',
      dynamicProps: {
        required: ({ record }) => record.get('registerEnabled'),
      },
    },
  ] : [];
  return {
    // autoCreate: true,
    autoQuery: true,
    transport: {
      read: {
        url: '/iam/choerodon/v1/system/setting',
        method: 'get',
        dataKey: null,
        transformResponse: (data) => {
          const parseData = JSON.parse(data);
          const {
            systemName,
            systemTitle,
            defaultLanguage,
            favicon,
            registerEnabled,
            autoCleanEmailRecord,
            autoCleanWebhookRecord,
            autoCleanSagaInstance,
            retainFailedSagaInstance,
            enableOpenPlatformMarket,
          } = parseData || {};
          const dft = {
            systemName: systemName || 'Choerodon',
            systemTitle: systemTitle || 'Choerodon | 多云应用技术集成平台',
            defaultLanguage: defaultLanguage || 'zh_CN',
            favicon: favicon || '',
            registerEnabled: registerEnabled || false,
            autoCleanEmailRecord: autoCleanEmailRecord || false,
            autoCleanWebhookRecord: autoCleanWebhookRecord || false,
            autoCleanSagaInstance: autoCleanSagaInstance || false,
            retainFailedSagaInstance: retainFailedSagaInstance !== false,
            enableOpenPlatformMarket,
          };
          if (data === '{}') {
            return ({ new: true, ...dft });
          }
          return ({
            ...parseData,
            ...dft,
          });
        },
      },
      update: ({ data: [data] }) => {
        const postData = { ...data };
        if (!data.autoCleanEmailRecord && data.autoCleanEmailRecordInterval) {
          postData.autoCleanEmailRecordInterval = null;
        }
        if (!data.autoCleanWebhookRecord && data.autoCleanWebhookRecordInterval) {
          postData.autoCleanWebhookRecordInterval = null;
        }
        if (!data.autoCleanSagaInstance && data.autoCleanSagaInstanceInterval) {
          postData.autoCleanSagaInstanceInterval = null;
          postData.retainFailedSagaInstance = true;
        }
        return ({
          url: '/iam/choerodon/v1/system/setting',
          method: 'post',
          data: postData,
        });
      },
    },
    fields: [
      {
        ...mapping.openAppMarket,
      },
      {
        name: 'systemName', type: 'string', label: format({ id: 'shortForplatform' }), defaultValue: 'Choerodon', required: true,
      },
      { name: 'favicon', type: 'string', label: '平台logo' },
      { name: 'systemTitle', type: 'string', label: format({ id: 'FullForplatform' }) },
      { name: 'defaultLanguage', type: 'string', label: format({ id: 'platformDefaultlanguage' }) },
      { name: 'resetGitlabPasswordUrl', type: 'url', label: format({ id: 'resetGitlabLink' }) },
      { name: 'registerEnabled', type: 'boolean', label: format({ id: 'isStartRegister' }) },
      {
        name: 'registerUrl',
        type: 'url',
        label: '注册页面链接',
        dynamicProps: {
          required: ({ record }) => record.get('registerEnabled'),
        },
      },
      { name: 'systemLogo', type: 'string', label: '平台导航栏图形标' },
      { name: 'defaultPassword', type: 'string', label: '平台默认密码' },
      { name: 'themeColor', type: 'string', label: format({ id: 'systemThemeColor' }) },
      { name: 'autoCleanEmailRecord', type: 'boolean' },
      { name: 'autoCleanWebhookRecord', type: 'boolean' },
      { name: 'autoCleanSagaInstance', type: 'boolean' },
      {
        name: 'autoCleanEmailRecordInterval',
        type: 'number',
        label: '日志保留时间',
        step: 1,
        min: 1,
        max: 1000,
        dynamicProps: {
          required: ({ record }) => record.get('autoCleanEmailRecord'),
        },
      },
      {
        name: 'autoCleanWebhookRecordInterval',
        type: 'number',
        label: '日志保留时间',
        step: 1,
        min: 1,
        max: 1000,
        dynamicProps: {
          required: ({ record }) => record.get('autoCleanWebhookRecord'),
        },
      },
      {
        name: 'autoCleanSagaInstanceInterval',
        type: 'number',
        label: '记录保留时间',
        step: 1,
        min: 1,
        max: 1000,
        dynamicProps: {
          required: ({ record }) => record.get('autoCleanSagaInstance'),
        },
      },
      {
        name: 'retainFailedSagaInstance',
        type: 'boolean',
        defaultValue: true,
      },
      ...fields,
    ],
  };
};

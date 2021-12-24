const verifyFormDataSetConfig = {
  autoCreate: true,
  fields: [
    {
      name: 'phone',
      type: 'phone',
      label: '手机号',
      required: true,
    },
    {
      name: 'captcha',
      type: 'string',
      label: '短信验证码',
      required: true,
      maxLength: 6,
      validator: (value) => {
        const reg = /^\d{6}$/;
        if (reg.test(value)) {
          return true;
        }
        return '验证码应为6位数字';
      },
    },
  ],
};
export default verifyFormDataSetConfig;

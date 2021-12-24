const newPhoneDataSetConfig = {
  autoCreate: true,
  fields: [
    {
      name: 'phone',
      type: 'phone',
      label: '新手机号码',
      required: true,
    },
    {
      name: 'captcha',
      type: 'string',
      label: '验证码',
      required: true,
    },
  ],
};
export default newPhoneDataSetConfig;

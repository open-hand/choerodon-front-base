const newPhoneDataSetConfig = {
  autoCreate: true,
  fields: [
    {
      name: 'phone',
      type: 'string',
      label: '新手机号码',
      required: true,
      pattern: /^1[3-9]\d{9}$/,
    },
    {
      name: 'password',
      type: 'string',
      label: '验证码',
      required: true,
    },
  ],
};
export default newPhoneDataSetConfig;

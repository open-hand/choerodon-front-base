const verifyFormDataSetConfig = {
  autoCreate: true,
  fields: [
    {
      name: 'phone',
      type: 'string',
      label: '手机号',
      required: true,
      pattern: /^1[3-9]\d{9}$/,
    //   computedProps: {
    //     disabled: ({ dataSet }) => {
    //       console.log(dataSet.originData[0].phone);
    //       return dataSet.current.get('phone');
    //     },
    //   },
    },
    {
      name: 'password',
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

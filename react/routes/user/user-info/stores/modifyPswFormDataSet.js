const modifyPswFormDataSetConfig = {
  autoCreate: true,
  fields: [
    {
      name: 'originPassword',
      type: 'string',
      label: '原密码',
      required: true,
    },
    {
      name: 'password',
      type: 'string',
      label: '新密码',
      required: true,
    },
    {
      name: 'ggg',
      type: 'string',
      label: '确认密码',
      required: true,
      ignore: 'always',
      validator: (value, name, record) => {
        if (record.get('password') !== value) {
          return '请确保两次输入密码相同';
        }
        return true;
      },
    },
  ],
};
export default modifyPswFormDataSetConfig;

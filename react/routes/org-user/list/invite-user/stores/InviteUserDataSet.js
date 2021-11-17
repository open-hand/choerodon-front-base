import { organizationsApiConfig, iamApi } from '@/api';

const emailReg = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

const InviteUserDataSet = ({
  id, intl, organizationId, orgInfoDataSet,
}) => {
  async function checkEmail(value, _name, _record) {
    try {
      if (orgInfoDataSet.current && orgInfoDataSet.current.get('emailSuffix')) {
        if (!emailReg.test(`${value}${orgInfoDataSet.current.get('emailSuffix')}`)) {
          return '请输入正确的邮箱地址。';
        }
      } else if (!emailReg.test(value)) {
        return '请输入正确的邮箱地址。';
      }
      const result = await iamApi.checkPhoneExitNoSelf({ email: value });
      if (result.failed) {
        return result.message;
      }
      return true;
    } catch (err) {
      return err?.message;
    }
  }
  return {
    selection: false,
    paging: false,
    transport: {
      create: () => ({
        ...organizationsApiConfig.invitation(),
        transformRequest: ((data) => {
          let tempData = data;
          if (orgInfoDataSet.current && orgInfoDataSet.current.get('emailSuffix')) {
            tempData = data.map((item) => ({
              ...item,
              email: `${item.email}${orgInfoDataSet.current.get('emailSuffix')}`,
            }));
          }
          return JSON.stringify(tempData);
        }),
      }),
    },
    fields: [
      {
        name: 'email', type: 'string', label: '邮箱', validator: checkEmail, required: true,
      },
      {
        name: 'roleId', label: '角色', textField: 'name', valueField: 'id',
      },
    ],
  };
};

export default InviteUserDataSet;

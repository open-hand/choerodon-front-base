import { axios } from '@choerodon/boot';

/**
 * 查询密码策略
 * @param {Number} organizationId 租户id
 */
export async function fetchPasswordPolicies(organizationId:number) {
  return axios.get(`iam/v1/${organizationId}/password-policies/query`);
}

/**
 * 发送验证码
 * @param {Number} organizationId 租户id
 */
export async function sendCaptcha(params: { type: 'phone' | 'email', phone: string, email?: string }) {
  const { type, phone, email } = params;

  const query = type === 'phone'
    ? {
      phone,
      businessScope: 'UPDATE_PASSWORD',
    }
    : {
      email,
      businessScope: 'UPDATE_PASSWORD',
    };

  return axios(`iam/hzero/v1/users/${type}/send-captcha`, {
    method: 'get',
    params: query,
  });
}

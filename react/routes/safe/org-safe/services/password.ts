import { axios } from '@choerodon/boot';

/**
 * 启用手机
 * @param {Number} organizationId 租户id
 * @param {String} params 参数
 */
export async function addUserPhoneCheckList(organizationId:number, params: any) {
  return axios(`iam/hzero/v1/${organizationId}/users/sec-check/enable/phone`, {
    method: 'PUT',
    data: params,
  });
}

/**
 * 禁用手机
 * @param {Number} organizationId 租户id
 * @param {String} params 参数
 */
export async function deleteUserPhoneCheckList(organizationId:number, params: any) {
  return axios(`iam/hzero/v1/${organizationId}/users/sec-check/disable/phone`, {
    method: 'PUT',
    data: params,
  });
}

/**
 * 启用邮箱
 * @param {Number} organizationId 租户id
 * @param {String} params 参数
 */
export async function addUserEmailCheckList(organizationId:number, params: any) {
  return axios(`iam/hzero/v1/${organizationId}/users/sec-check/enable/email`, {
    method: 'PUT',
    data: params,
  });
}

/**
 * 禁用邮箱
 * @param {Number} organizationId 租户id
 * @param {String} params 参数
 */
export async function deleteUserEmailCheckList(organizationId:number, params: any) {
  return axios(`iam/hzero/v1/${organizationId}/users/sec-check/disable/email`, {
    method: 'PUT',
    data: params,
  });
}

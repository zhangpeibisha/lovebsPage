import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/authentication/form',
    method:'post',
    params:params
  })
}

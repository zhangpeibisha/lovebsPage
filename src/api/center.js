import request from '@/utils/request'

export function findUserInfo() {
  return request({
    url:'/account/user/info',
    method:'get',
  })
}
